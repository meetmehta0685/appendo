from typing import TypeVar, Generic, Type, Optional, List, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.base_class import Base

ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository(Generic[ModelType]):
  """Asynchronous Repository pattern wrapper for database operations."""
  
  def __init__(self, model: Type[ModelType], db: AsyncSession):
    self.model = model
    self.db = db

  async def get(self, id: Any) -> Optional[ModelType]:
    """Retrieve row by primary key."""
    result = await self.db.execute(select(self.model).where(self.model.id == id))
    return result.scalars().first()

  async def get_multi(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
    """Retrieve list of model rows."""
    result = await self.db.execute(select(self.model).offset(skip).limit(limit))
    return list(result.scalars().all())

  async def create(self, obj_in: Any) -> ModelType:
    """Insert and commit new model instance."""
    self.db.add(obj_in)
    await self.db.flush()
    return obj_in

  async def delete(self, id: Any) -> Optional[ModelType]:
    """Delete database record by key."""
    obj = await self.get(id)
    if obj:
      await self.db.delete(obj)
      await self.db.flush()
    return obj
