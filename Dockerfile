FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build

WORKDIR /src
COPY . .

WORKDIR "/src/WebUI"
RUN dotnet restore "WebUI.csproj"
RUN dotnet build "WebUI.csproj" -c Release -o /app/build
RUN dotnet publish "WebUI.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
EXPOSE 80
EXPOSE 443

WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "VkGraphBuilder.WebUI.dll"]
