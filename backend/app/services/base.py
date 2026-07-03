from typing import Generic, TypeVar
from app.repositories.base import BaseRepository

RepoType = TypeVar("RepoType", bound=BaseRepository)

class BaseService(Generic[RepoType]):
  """Standard base class for business logic services, linking to a persistence repository."""
  def __init__(self, repository: RepoType):
    self.repository = repository
