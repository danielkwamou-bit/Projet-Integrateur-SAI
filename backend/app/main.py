from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.models import User, Mesure, Action, Alerte, SeuilConfig  # noqa: F401
from app.routes import auth, mesures, actionneurs, alertes, websocket
from fastapi_mqtt import FastMQTT, MQTTConfig
 
Base.metadata.create_all(bind=engine)
 
app = FastAPI(
    title=settings.APP_NAME,
    description="API REST — Système de surveillance agricole IoT",
    version="1.0.0",
)
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration MQTT
config = MQTTConfig(host="localhost", port=1883)
mqtt = FastMQTT(config=config)
mqtt.init_app(app)

@mqtt.on_connect()
def connect(client, flags, rc, properties):
    print("Connecté au broker Mosquitto !")
    mqtt.client.subscribe("esp32/sensors/+")

@mqtt.on_message()
async def message(client, topic, payload, qos, properties):
    data = payload.decode()
    print(f"Message reçu sur {topic}: {data}")
    # Ici, vous pourriez insérer les données dans votre DB (PostgreSQL, InfluxDB...)
@app.get("/")
async def root():
    return {"message": "Le backend FastAPI écoute le MQTT"}
 
app.include_router(auth.router)
app.include_router(mesures.router)
app.include_router(actionneurs.router)
app.include_router(alertes.router)
app.include_router(websocket.router)
 
 
@app.get("/", tags=["Santé"])
def health_check():
    return {"status": "ok", "app": settings.APP_NAME}