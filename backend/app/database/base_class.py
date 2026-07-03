from sqlalchemy.orm import DeclarativeBase, declared_attr

class Base(DeclarativeBase):
  """SQLAlchemy 2.0 base class for all database models with auto-generated table names."""
  
  @declared_attr.directive
  def __tablename__(cls) -> str:
    return cls.__name__.lower()
