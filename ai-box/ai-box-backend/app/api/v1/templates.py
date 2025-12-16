from fastapi import APIRouter, HTTPException

router = APIRouter()

TEMPLATES = [
    {
        "id": "legal_advisor",
        "name": "Юридический советник",
        "description": "Анализирует контракты и отвечает на юридические вопросы.",
        "role": "legal_advisor",
    },
    {
        "id": "accountant",
        "name": "Бухгалтер",
        "description": "Помогает с финансовой отчетностью и подсчетами.",
        "role": "accountant",
    },
    {
        "id": "marketer",
        "name": "Маркетолог",
        "description": "Генерирует идеи кампаний и анализирует рынок.",
        "role": "marketer",
    },
    {
        "id": "artist",
        "name": "Художник",
        "description": "Создает креативные описания и промо материалы.",
        "role": "artist",
    },
]


@router.get("/")
async def list_templates():
    return {"items": TEMPLATES}


@router.get("/{template_id}")
async def get_template(template_id: str):
    template = next((t for t in TEMPLATES if t["id"] == template_id), None)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template

