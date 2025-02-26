# Use Maven with JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Set working directory
WORKDIR /app

# Copy only the pom.xml first (to cache dependencies)
COPY src ./src

COPY pom.xml .

# Download dependencies
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 9091

# Run the application
CMD ["java", "-jar", "app.jar"]
