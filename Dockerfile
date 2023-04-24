FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build

WORKDIR /src
COPY . .

WORKDIR /app/publish
RUN apt-get update -y  \
    && apt-get install python3 python3-venv -y \
    && python3 -m venv venv \
    && venv/bin/python3 -m pip install -f /src/NetworkXWrapper/requirements.txt

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
EXPOSE 80
EXPOSE 443

WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "VkGraphBuilder.WebUI.dll"]
