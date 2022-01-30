from bs4 import BeautifulSoup
import requests
import json

base_URL = "https://www.pro-football-reference.com/players/"
api_URL = "http://localhost:4000/nfl/"
nflref_URL = "https://www.pro-football-reference.com"

letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

all_players = []
rbs = []

count = 0
for l in letters:
    url = base_URL + l
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')

    section = soup.find(id="all_players")
    player_names = section.find_all("p")

    for p in player_names:
        player = {}
        withinMemory = False
        innertext = p.text.split("(")
        playerName = innertext[0].strip()
        playerInfo = innertext[1].split(') ')
        
        player['name'] = playerName
        player['position'] = playerInfo[0]
        player['yearsPlayed'] = [int(yr) for yr in playerInfo[1].split('-')]
        player['pageURL'] = p.a['href']

        if player['position'] not in ['WR', 'RB', 'QB', 'TE'] or player['yearsPlayed'][1] - player['yearsPlayed'][0] <= 2 or player['yearsPlayed'][0] < 2004: 
            continue

        playerPage = requests.get(nflref_URL+player['pageURL'])
        soup = BeautifulSoup(playerPage.content, 'html.parser')

        imgdiv = soup.find("div", {"class": "media-item"})
        if imgdiv: player['imgURL'] = imgdiv.find("img")['src']
        else: continue

        careerstatssection = None
        if player['position'] == 'QB':
            careerstatssection = soup.find(id="passing")
        elif player['position'] == 'RB': 
            careerstatssection = soup.find(id="rushing_and_receiving")
        else:
            careerstatssection = soup.find(id="receiving_and_rushing")


        if careerstatssection: careerstatssection = careerstatssection.find("tfoot").find("tr")
        else: continue

        careerstats = {stat['data-stat']: stat.text for stat in careerstatssection }
        for s in ['year_id', 'team', 'pos', 'uniform_number']: careerstats.pop(s)
        player['careerStats'] = json.dumps(careerstats)

        if (int(careerstats['rec_yds']) >= 1800): 
            print(player['name'])
            print()
            post = requests.post(api_URL, player)


        
        
print(len(rbs))

        
