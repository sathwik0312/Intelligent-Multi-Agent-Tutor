from youtube_transcript_api import YouTubeTranscriptApi
from typing import Dict, Any
import re

def get_youtube_id(url: str) -> str:
    """Extracts the video ID from a YouTube URL."""
    reg = r'(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})'
    match = re.search(reg, url)
    return match.group(1) if match else None

def fetch_youtube_transcript(url: str) -> str:
    """Fetches the transcript for a given YouTube video URL."""
    video_id = get_youtube_id(url)
    if not video_id:
        return "Error: Invalid YouTube URL"
    
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join([t['text'] for t in transcript_list])
    except Exception as e:
        return f"Error fetching transcript: {str(e)}"
