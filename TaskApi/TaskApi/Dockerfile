# Use the full SDK image to build and run the app
FROM mcr.microsoft.com/dotnet/sdk:9.0

# Set the working directory inside the container
WORKDIR /app

# Copy all project files into the container
COPY . .

# Restore dependencies
RUN dotnet restore

# Build the app
RUN dotnet build -c Release

# Run the app
CMD ["dotnet", "DotNet.Docker.dll"]