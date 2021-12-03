from bs4 import BeautifulSoup
import requests
import json

base_URL = "https://www.baseball-reference.com/players/"
api_URL = "http://localhost:4000/players"
bbref_URL = "https://www.baseball-reference.com"

letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

all_players = []

count = 0
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
        yearsPlayed = [int(yr) for yr in innertext[1].strip(")").split("-")]

        if count < 1 and yearsPlayed[0] >= 2000 and yearsPlayed[1] - yearsPlayed[0] >= 3: 
            withinMemory = True

            if withinMemory:
                playerName = innertext[0].strip()
                playerPageURL = p.a['href']
                
                # scrape player's baseball reference page for stats and such
                page = requests.get(bbref_URL + playerPageURL)
                soup = BeautifulSoup(page.content, 'html.parser')

                position = soup.find(id="info").find("p").text.split()
                position = position[1] if len(position) == 2 else position[1]+' '+position[2]



                imgdiv = soup.find("div", {"class": "media-item"})
                if imgdiv: player['imgURL'] = imgdiv.find("img")['src']
                else: continue

                careerStats = {}
                if position == "Pitcher":
                    content = soup.find(id="pitching_standard")

                    career_stats_section = soup.find("tfoot").find("tr")

                    for stat in career_stats_section:
                        careerStats[stat['data-stat']] = stat.text

                    career_war = soup.find(id="div_pitching_value")
                    print(career_war)

                    
                    # for stat in career_stats_section:
                    #     careerStats[stat['data-stat']] = stat.text

                else:
                    content = soup.find(id="batting_standard")
                    career_stats_section = soup.find("tfoot").find("tr")

                    for stat in career_stats_section:
                        careerStats[stat['data-stat']] = stat.text

                if int(careerStats['G']) < 200:
                    continue

                player['name'] = playerName
                player['yearsPlayed'] = yearsPlayed
                player['pageURL'] = playerPageURL
                player['position'] = position
                player['careerStats'] = json.dumps(careerStats)

                all_players.append(player)

                print(player['name'])
                print()

                count+=1

                # post = requests.post(api_URL, player)

# print(all_players)

        
