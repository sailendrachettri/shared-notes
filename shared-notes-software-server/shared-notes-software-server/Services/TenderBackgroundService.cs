public class TenderBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public TenderBackgroundService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();

            var scraper = scope.ServiceProvider.GetRequiredService<TenderScraperService>();
            var service = scope.ServiceProvider.GetRequiredService<TenderService>();

            var tenders = await scraper.FetchTenders();
            await service.SaveTenders(tenders);

            await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
        }
    }
}