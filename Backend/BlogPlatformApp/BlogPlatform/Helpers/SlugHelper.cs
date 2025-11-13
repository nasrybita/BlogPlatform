namespace BlogPlatform.Helpers
{
    public static class SlugHelper
    {
        //Make URL-friendly slugs
        public static string Slugify(string text)
        {

            if (string.IsNullOrEmpty(text))
            {
                return string.Empty;
            }
                

            // Convert to lowercase
            text = text.ToLowerInvariant();

            // Remove invalid characters (keep letters, numbers, dash, and space)
            text = System.Text.RegularExpressions.Regex.Replace(text, @"[^a-z0-9\s-]", "");

            // Replace multiple spaces or dashes with a single space
            text = System.Text.RegularExpressions.Regex.Replace(text, @"[\s-]+", " ").Trim();

            // Replace spaces with dash
            text = text.Replace(" ", "-");

            return text;
        }
    }
}
