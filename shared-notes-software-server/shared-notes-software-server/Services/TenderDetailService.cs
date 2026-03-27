using Microsoft.Playwright;

public class TenderDetailService
{
    public async Task<object?> GetTenderDetails(string tenderUniqueId)
    {
        try
        {
            using var playwright = await Playwright.CreateAsync();
            await using var browser = await playwright.Chromium.LaunchAsync(new() { Headless = true });
            var page = await browser.NewPageAsync();

            await page.GotoAsync("https://www.sikkimtender.gov.in/nicgep/app?page=FrontEndTendersByOrganisation&service=page");
            await page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Collect all category hrefs first (avoids stale element refs)
            var categoryUrls = new List<string>();
            var links = await page.QuerySelectorAllAsync("a.link2");

            foreach (var link in links)
            {
                var countText = (await link.InnerTextAsync()).Trim();
                if (!int.TryParse(countText, out int count) || count == 0) continue;

                var href = await link.GetAttributeAsync("href");
                if (!string.IsNullOrEmpty(href))
                    categoryUrls.Add("https://www.sikkimtender.gov.in" + href);
            }

            foreach (var categoryUrl in categoryUrls)
            {
                await page.GotoAsync(categoryUrl);
                await page.WaitForLoadStateAsync(LoadState.NetworkIdle);

                var rows = await page.QuerySelectorAllAsync("table.list_table tr");

                string? detailHref = null;

                foreach (var row in rows)
                {
                    var cols = await row.QuerySelectorAllAsync("td");
                    if (cols.Count < 6) continue;

                    var rawText = await cols[4].InnerTextAsync();
                    if (!rawText.Contains(tenderUniqueId)) continue;

                    var linkEl = await cols[4].QuerySelectorAsync("a");
                    if (linkEl == null) continue;

                    detailHref = await linkEl.GetAttributeAsync("href");
                    break;
                }

                if (detailHref == null) continue;

                // Navigate directly by URL — no click/navigation race
                var detailUrl = "https://www.sikkimtender.gov.in" + detailHref;
                await page.GotoAsync(detailUrl);
                await page.WaitForLoadStateAsync(LoadState.NetworkIdle);

                // ✅ Scrape ALL label→value pairs from the detail table dynamically
                var allFields = new Dictionary<string, string>();


                var captionCells = await page.QuerySelectorAllAsync("td.td_caption");

                foreach (var caption in captionCells)
                {
                    string label = "";
                    try { label = (await caption.InnerTextAsync()).Trim().TrimEnd(':'); }
                    catch { continue; }

                    if (string.IsNullOrWhiteSpace(label)) continue;

                    try
                    {
                        var value = await caption.EvaluateAsync<string>(
                            "el => el.nextElementSibling?.innerText?.trim() ?? ''"
                        );

                        if (!string.IsNullOrWhiteSpace(value) && !allFields.ContainsKey(label))
                            allFields[label] = value;
                    }
                    catch { /* skip */ }
                }
                // ✅ Scrape document links if available
                var docLinks = new List<object>();
                var allAnchors = await page.QuerySelectorAllAsync("a[href]");

                foreach (var anchor in allAnchors)
                {
                    var docHref = await anchor.GetAttributeAsync("href");
                    var docText = (await anchor.InnerTextAsync()).Trim();

                    if (string.IsNullOrEmpty(docHref) || string.IsNullOrEmpty(docText)) continue;

                    // NIC GePNIC doc links contain these patterns
                    if (docHref.Contains("download", StringComparison.OrdinalIgnoreCase) ||
                        docHref.Contains("ViewDoc", StringComparison.OrdinalIgnoreCase) ||
                        docHref.Contains("getDoc", StringComparison.OrdinalIgnoreCase) ||
                        docHref.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
                    {
                        docLinks.Add(new
                        {
                            Name = docText,
                            Url = docHref.StartsWith("http") ? docHref : "https://www.sikkimtender.gov.in" + docHref
                        });
                    }
                }

                return new
                {
                    TenderUniqueId = tenderUniqueId,
                    ScrapedAt = DateTime.UtcNow,         // tells client when data was fetched
                    Fields = allFields,
                    Documents = docLinks
                };
            }

            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[TenderDetailService] Error: {ex.Message}");
            return null;
        }
    }

    public async Task<string?> GetLiveSessionUrl(string tenderUniqueId)
    {
        try
        {
            using var playwright = await Playwright.CreateAsync();
            await using var browser = await playwright.Chromium.LaunchAsync(new() { Headless = true });
            var page = await browser.NewPageAsync();

            await page.GotoAsync("https://www.sikkimtender.gov.in/nicgep/app?page=FrontEndTendersByOrganisation&service=page");
            await page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            var categoryUrls = new List<string>();
            var links = await page.QuerySelectorAllAsync("a.link2");

            foreach (var link in links)
            {
                var countText = (await link.InnerTextAsync()).Trim();
                if (!int.TryParse(countText, out int count) || count == 0) continue;

                var href = await link.GetAttributeAsync("href");
                if (!string.IsNullOrEmpty(href))
                    categoryUrls.Add("https://www.sikkimtender.gov.in" + href);
            }

            foreach (var categoryUrl in categoryUrls)
            {
                await page.GotoAsync(categoryUrl);
                await page.WaitForLoadStateAsync(LoadState.NetworkIdle);

                var rows = await page.QuerySelectorAllAsync("table.list_table tr");

                foreach (var row in rows)
                {
                    var cols = await row.QuerySelectorAllAsync("td");
                    if (cols.Count < 6) continue;

                    var rawText = await cols[4].InnerTextAsync();
                    if (!rawText.Contains(tenderUniqueId)) continue;

                    var linkEl = await cols[4].QuerySelectorAsync("a");
                    if (linkEl == null) continue;

                    var detailHref = await linkEl.GetAttributeAsync("href");
                    if (string.IsNullOrEmpty(detailHref)) continue;

                    // ✅ Return the fresh session URL immediately — don't navigate away
                    return "https://www.sikkimtender.gov.in" + detailHref;
                }
            }

            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[GetLiveSessionUrl] Error: {ex.Message}");
            return null;
        }
    }
}