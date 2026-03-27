using Microsoft.Playwright;
using shared_notes_software_server.Models;
using System.Xml;

public class TenderScraperService
{
    public async Task<List<TenderDto>> FetchTenders()
    {
        var tenders = new List<TenderDto>();

        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync(new()
        {
            Headless = true
        });

        var page = await browser.NewPageAsync();

        await page.GotoAsync("https://www.sikkimtender.gov.in/nicgep/app?page=FrontEndTendersByOrganisation&service=page");

        await page.WaitForLoadStateAsync(LoadState.NetworkIdle);

        // 🔥 STEP 1: collect all category links
        var linkHrefs = new List<string>();

        var links = await page.QuerySelectorAllAsync("a.link2");

        foreach (var link in links)
        {
            var countText = (await link.InnerTextAsync()).Trim();

            if (!int.TryParse(countText, out int count) || count == 0)
                continue;

            var href = await link.GetAttributeAsync("href");

            if (!string.IsNullOrEmpty(href))
            {
                linkHrefs.Add("https://www.sikkimtender.gov.in" + href);
            }
        }

        // 🔥 STEP 2: visit each category page
        foreach (var url in linkHrefs)
        {
            await page.GotoAsync(url);

            await page.WaitForLoadStateAsync(LoadState.NetworkIdle);
            await Task.Delay(2000);

            var rows = await page.QuerySelectorAllAsync("table.list_table tr");

            foreach (var row in rows)
            {
                var cols = await row.QuerySelectorAllAsync("td");

                if (cols.Count < 6) continue;

                var publishedText = (await cols[1].InnerTextAsync()).Trim();
                var closingText = (await cols[2].InnerTextAsync()).Trim();

                var titleCell = cols[4];

                var linkEl = await titleCell.QuerySelectorAsync("a");
                if (linkEl == null) continue;

                var rawText = await titleCell.InnerTextAsync();

                // Extract all [....] parts
                var matches = System.Text.RegularExpressions.Regex.Matches(rawText, @"\[(.*?)\]");

                string title = "";
                string refNo = "";
                string tenderId = "";

                // [Title]
                if (matches.Count >= 1)
                    title = matches[0].Groups[1].Value.Trim();

                // [Ref No]
                if (matches.Count >= 2)
                    refNo = matches[1].Groups[1].Value.Trim();

                // [Tender Unique ID]
                if (matches.Count >= 3)
                    tenderId = matches[2].Groups[1].Value.Trim();
                var href = await linkEl.GetAttributeAsync("href");

                var fullLink = "https://www.sikkimtender.gov.in" + href;

                tenders.Add(new TenderDto
                {
                    Title = title,
                    RefNo = refNo,
                    TenderUniqueId = tenderId,
                    Published_Date = ParseDate(publishedText),
                    Last_Date = ParseDate(closingText),
                    Tags = GenerateTags(title),
                    Source = "sikkim_eproc"
                });
            }
        }

        return tenders;
    }

    private DateTime? ParseDate(string text)
    {
        var formats = new[]
        {
        "dd-MMM-yyyy hh:mm tt",
        "dd-MMM-yyyy HH:mm",
        "dd-MM-yyyy"
    };

        if (DateTime.TryParseExact(text, formats,
            System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.None,
            out var dt))
        {
            return dt;
        }

        return null;
    }

    private string[] GenerateTags(string title)
    {
        var t = title.ToLower();
        var tags = new List<string>();

        if (t.Contains("software") || t.Contains("it")) tags.Add("IT");
        if (t.Contains("hardware")) tags.Add("Hardware");
        if (t.Contains("consult")) tags.Add("Consulting");
        if (t.Contains("service")) tags.Add("Services");
        if (t.Contains("network")) tags.Add("Networking");

        return tags.ToArray();
    }
}