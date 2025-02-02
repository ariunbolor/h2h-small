# API Documentation

## Authentication

All protected endpoints require JWT token in Authorization header:
```http
Authorization: Bearer <your_jwt_token>
```

## Error Responses

All endpoints return standard error format:
```json
{
    "error": "Error message here",
    "code": "ERROR_CODE"
}
```

## Detailed Endpoints

### Authentication

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

Request Body:
{
    "username": "string",
    "password": "string",
    "role": "customer|driver",
    "full_name": "string",
    "phone": "string",
    "vehicle_number": "string",  // required for drivers
    "license_number": "string"   // required for drivers
}

Response 200:
{
    "success": true,
    "message": "Registration successful"
}

Response 400:
{
    "error": "Username already exists",
    "code": "USER_EXISTS"
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

Request Body:
{
    "username": "string",
    "password": "string"
}

Response 200:
{
    "token": "jwt_token_string",
    "role": "admin|driver|customer",
    "user": {
        "id": "number",
        "username": "string",
        "full_name": "string"
    }
}
```

### Parcels

#### 1. Create Parcel
```http
POST /api/parcels
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "sender": "string",
    "recipient": "string",
    "pickup_address": "string",
    "delivery_address": "string"
}

Response 200:
{
    "id": "parcel_id",
    "status": "pending"
}
```

#### 2. Get All Parcels
```http
GET /api/parcels
Authorization: Bearer <token>

Response 200:
[
    {
        "id": "string",
        "sender": "string",
        "recipient": "string",
        "status": "string",
        "location": "string",
        "assigned_driver_id": "number",
        "pickup_address": "string",
        "delivery_address": "string",
        "created_at": "datetime"
    }
]
```

### Driver Operations

#### 1. Update Location
```http
POST /api/driver/location
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "latitude": "number",
    "longitude": "number"
}

Response 200:
{
    "success": true
}
```

#### 2. Get Assignments
```http
GET /api/driver/assignments
Authorization: Bearer <token>

Response 200:
[
    {
        "id": "string",
        "pickup_address": "string",
        "delivery_address": "string",
        "status": "string",
        "recipient": "string"
    }
]
```

### Admin Operations

#### 1. Get Statistics
```http
GET /api/admin/stats
Authorization: Bearer <token>

Response 200:
{
    "total_parcels": "number",
    "pending": "number",
    "in_transit": "number",
    "delivered": "number",
    "total_drivers": "number",
    "active_drivers": "number"
}
```

#### 2. Assign Driver
```http
POST /api/admin/assign-driver
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "parcel_id": "string",
    "driver_id": "number"
}

Response 200:
{
    "success": true,
    "status": "assigned"
}
```
