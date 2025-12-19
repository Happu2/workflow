import os
import requests


def web_search(query: str) -> str:
    key = os.getenv("SERP_API_KEY")
    if not key:
        return ""

    res = requests.get(
        "https://serpapi.com/search",
        params={"q": query, "api_key": key},
        timeout=10
    ).json()

    return "\n".join(
        r.get("snippet", "")
        for r in res.get("organic_results", [])[:3]
    )
