from bs4 import BeautifulSoup
import requests
import json

base_URL = "https://www.baseball-reference.com/players/"
api_URL = "http://localhost:3001/players"
bbref_URL = "https://www.baseball-reference.com"

letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

all_players = []

for l in letters:
    url = base_URL + l
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')

    section = soup.find(id="div_players_")
    player_names = section.find_all("p")

    for p in player_names:
        player = {}
        withinMemory = False
        innertext = p.text.split("(")
        playerYearsPlayed = innertext[1].strip(")").split("-")
        playerYearsPlayed = [int(yr) for yr in playerYearsPlayed]

        if playerYearsPlayed[0] >= 1995 and playerYearsPlayed[0] != playerYearsPlayed[1]: 
            withinMemory = True

            if withinMemory:
                playerName = innertext[0].strip()
                playerPageURL = p.a['href']

                player['name'] = playerName
                player['yearsPlayed'] = playerYearsPlayed
                player['pageURL'] = playerPageURL

                # scrape player's baseball reference page for stats and such
                page = requests.get(bbref_URL + playerPageURL)
                soup = BeautifulSoup(page.content, 'html.parser')

                position = soup.find(id="info").find("p").text.split()[1]
                imgdiv = soup.find("div", {"class": "media-item"})
                
                imgURL = ""
                if imgdiv:
                    imgURL = imgdiv.find("img")['src']
                else: 
                    continue

                careerStats = {}
                if position == "Pitcher":
                    content = soup.find(id="pitching_standard")
                    career_stats_section = soup.find("tfoot").find("tr")
                    
                    for stat in career_stats_section:
                        careerStats[stat['data-stat']] = stat.text

                else:
                    content = soup.find(id="batting_standard")
                    career_stats_section = soup.find("tfoot").find("tr")

                    for stat in career_stats_section:
                        careerStats[stat['data-stat']] = stat.text

                if int(careerStats['G']) < 60:
                    continue

                player['imgURL'] = imgURL
                player['position'] = position
                player['careerStats'] = json.dumps(careerStats)

                post = requests.post(api_URL, player)

        
