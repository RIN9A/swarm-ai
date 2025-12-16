from typing import Any, Dict, List

from langchain.tools import tool


@tool
def pdf_parser(file_path: str) -> str:
    """Parse a PDF file and return basic info."""
    return f"Parsed PDF at {file_path}"


@tool
def document_generator(title: str, content: str, format: str = "markdown") -> str:
    """Generate a simple document string."""
    return f"Document '{title}' ({format}): {content[:100]}..."


@tool
def email_sender(to: str, subject: str, body: str) -> str:
    """Stub email sender."""
    return f"Email queued to {to} with subject '{subject}'"


@tool
def spreadsheet_reader(file_path: str) -> str:
    """Read spreadsheet stub."""
    return f"Spreadsheet read from {file_path}"


@tool
def c1_api_call(endpoint: str, method: str = "GET", data: Dict[str, Any] | None = None) -> str:
    """Call internal API placeholder."""
    return f"Called {endpoint} with {method} and data={data}"


@tool
def image_generator(prompt: str, size: str = "1024x1024") -> str:
    """Generate image stub."""
    return f"Generated image for '{prompt}' at size {size}"


@tool
def web_search(query: str) -> List[str]:
    """Search the web stub."""
    return [f"Result for {query} #1", f"Result for {query} #2"]


@tool
def database_query(query: str, db_name: str = "default") -> str:
    """Execute a database query stub."""
    return f"Ran query on {db_name}: {query}"


@tool
def translate_text(text: str, target_language: str = "en") -> str:
    """Translate text stub."""
    return f"[{target_language}] {text}"


@tool
def summarize_text(text: str) -> str:
    """Summarize text stub."""
    return f"Summary: {text[:120]}..."


@tool
def api_call(url: str, method: str = "GET", headers: Dict[str, str] | None = None, data: Dict[str, Any] | None = None) -> str:
    """Generic API call stub."""
    return f"{method} {url} with headers={headers} and data={data}"


TOOLS_REGISTRY = {
    "pdf_parser": pdf_parser,
    "document_generator": document_generator,
    "email_sender": email_sender,
    "spreadsheet_reader": spreadsheet_reader,
    "c1_api_call": c1_api_call,
    "image_generator": image_generator,
    "web_search": web_search,
    "database_query": database_query,
    "translate_text": translate_text,
    "summarize_text": summarize_text,
    "api_call": api_call,
}

