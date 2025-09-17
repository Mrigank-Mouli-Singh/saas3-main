from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
import uuid
from app.db.database import Base

def uuid4_str():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    user_id = Column(String, primary_key=True, default=uuid4_str)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    documents = relationship("Document", back_populates="user")

class Document(Base):
    __tablename__ = "documents"
    doc_id = Column(String, primary_key=True, default=uuid4_str)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    filename = Column(String, nullable=False)
    uploaded_on = Column(DateTime, server_default=func.now())
    expiry_date = Column(DateTime, nullable=True)
    status = Column(String, nullable=True)      # Active, Renewal Due, Expired
    risk_score = Column(String, nullable=True)  # Low, Medium, High
    parties = Column(String, nullable=True)

    user = relationship("User", back_populates="documents")
    chunks = relationship("Chunk", back_populates="document")

class Chunk(Base):
    __tablename__ = "chunks"
    chunk_id = Column(String, primary_key=True)
    doc_id = Column(String, ForeignKey("documents.doc_id"), nullable=False)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    text_chunk = Column(Text, nullable=False)
    embedding = Column(Vector(4))  # 4-dim for mock embeddings
    meta = Column("metadata", JSON)

    document = relationship("Document", back_populates="chunks")
