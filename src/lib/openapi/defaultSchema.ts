export const DEFAULT_SCHEMA = `openapi: 3.0.3
info:
  title: Pet Store API
  version: 1.0.0
  description: A sample API for managing pets
servers:
  - url: https://api.petstore.example.com/v1
paths:
  /pets:
    get:
      summary: List all pets
      operationId: listPets
      tags:
        - pet
      responses:
        '200':
          description: A list of pets
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
    post:
      summary: Create a pet
      operationId: createPet
      tags:
        - pet
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Pet'
      responses:
        '201':
          description: Pet created
  /pets/{petId}:
    get:
      summary: Get a pet by ID
      operationId: getPet
      tags:
        - pet
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Pet details
    put:
      summary: Update a pet
      operationId: updatePet
      tags:
        - pet
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Pet updated
    delete:
      summary: Delete a pet
      operationId: deletePet
      tags:
        - pet
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: Pet deleted
components:
  schemas:
    Pet:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: string
        name:
          type: string
        tag:
          type: string
`;
