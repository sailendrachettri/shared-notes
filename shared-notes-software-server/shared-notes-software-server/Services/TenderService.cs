using shared_notes_software_server.Models;

public class TenderService
{
    private readonly DbHelper _db;

    public TenderService(DbHelper db)
    {
        _db = db;
    }

    public async Task SaveTenders(List<TenderDto> tenders)
    {
        foreach (var t in tenders)
        {
            var query = @"
                INSERT INTO utbl_tenders 
                (title, ref_no, tender_unique_id, published_date, last_date, tags, source)
                VALUES (@title, @refno, @tid, @published, @last, @tags, @source)
                ON CONFLICT (tender_unique_id) DO NOTHING;
            ";

            await _db.ExecuteNonQueryAsync(query, cmd =>
            {
                cmd.Parameters.AddWithValue("title", t.Title);
                cmd.Parameters.AddWithValue("refno", t.RefNo ?? "");
                cmd.Parameters.AddWithValue("tid", t.TenderUniqueId ?? "");
                cmd.Parameters.AddWithValue("published", (object?)t.Published_Date ?? DBNull.Value);
                cmd.Parameters.AddWithValue("last", (object?)t.Last_Date ?? DBNull.Value);
                cmd.Parameters.AddWithValue("tags", t.Tags);
                cmd.Parameters.AddWithValue("source", t.Source);
            });
        }
    }
}