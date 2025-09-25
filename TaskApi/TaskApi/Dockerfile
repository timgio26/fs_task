# Use the full SDK image to build and run the app
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
# Set the working directory inside the container
WORKDIR /app
# Copy all project files into the container
COPY . .
# Restore dependencies
RUN dotnet restore
# Build the app
# RUN dotnet build -c Release
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:9.0
# Set the working directory inside the container
WORKDIR /app
COPY --from=build  /app/out ./
# Run the app
EXPOSE 8080
CMD ["dotnet", "TaskApi.dll"]