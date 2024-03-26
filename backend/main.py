from fastapi import FastAPI
from databases import Database
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "mysql://root:wag0nrM$@localhost/cs591"
database = Database(DATABASE_URL)

# engine = create_async_engine(DATABASE_URL, echo=True)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)

# Base = declarative_base()

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}