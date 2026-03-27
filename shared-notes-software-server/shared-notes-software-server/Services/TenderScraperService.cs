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
        var tags = new HashSet<string>();

        // 🔹 SOFTWARE / IT PROJECTS
        if (ContainsAny(t, "software", "application", "system", "portal", "website", "web", "app", "mobile", "erp", "crm", "dashboard", "management system"))
            tags.Add("IT");

        // 🔹 DEVELOPMENT SPECIFIC
        if (ContainsAny(t, "development", "design", "implementation", "customization", "upgrade", "enhancement"))
            tags.Add("Development");

        // 🔹 CLOUD / HOSTING
        if (ContainsAny(t, "cloud", "hosting", "server", "aws", "azure", "deployment", "saas"))
            tags.Add("Cloud");

        // 🔹 HARDWARE
        if (ContainsAny(t, "hardware", "supply", "desktop", "laptop", "printer", "server machine", "equipment"))
            tags.Add("Hardware");

        // 🔹 NETWORKING
        if (ContainsAny(t, "network", "lan", "wan", "cabling", "router", "switch", "firewall"))
            tags.Add("Networking");

        // 🔹 CONSULTING / SERVICES
        if (ContainsAny(t, "consult", "audit", "support", "maintenance", "amc", "service"))
            tags.Add("Services");

        // 🔹 SECURITY
        if (ContainsAny(t, "security", "cyber", "cctv", "surveillance", "firewall", "antivirus"))
            tags.Add("Security");

        // 🔹 DATA / AI
        if (ContainsAny(t, "data", "analytics", "ai", "machine learning", "ml", "big data"))
            tags.Add("Data/AI");

        // 🔹 GOV / E-GOV PROJECTS (very important for tenders)
        if (ContainsAny(t, "e-governance", "digitization", "online system", "automation"))
            tags.Add("E-Governance");

        return tags.ToArray();
    }

    private bool ContainsAny(string text, params string[] keywords)
    {
        return keywords.Any(k => text.Contains(k));
    }
}