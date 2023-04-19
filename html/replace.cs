<!-- https://jay23606.github.io/chat-gpt-voice/html/replace.cs -->

public static class StringExtensions
{
    public static string ReplaceCaseInsensitive(this string str, string oldValue, string newValue)
    {
        return string.IsNullOrEmpty(oldValue) ? str :
            Regex.Replace(str, Regex.Escape(oldValue), newValue ?? oldValue, RegexOptions.IgnoreCase);
    }
    
    public static string ReplaceSuffixCaseInsensitive(this string str, string suffix, string newValue)
    {
        if (string.IsNullOrEmpty(suffix)) return str;
        return str.EndsWith(suffix, StringComparison.OrdinalIgnoreCase) ? 
            str.Substring(0, str.Length - suffix.Length) + (newValue ?? string.Empty) : str;
    }
}
