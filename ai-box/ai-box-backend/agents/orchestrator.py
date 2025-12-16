class Orchestrator:
    """Placeholder orchestrator for coordinating multiple agents."""

    def __init__(self):
        self.registry = {}

    def register(self, name: str, agent):
        self.registry[name] = agent

    def get(self, name: str):
        return self.registry.get(name)

