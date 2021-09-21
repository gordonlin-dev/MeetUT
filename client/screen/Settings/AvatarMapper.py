import os
import json

if __name__ == "__main__":
    avatar_map = {}
    avatar_id = 0
    for file in os.listdir("../../assets/Avatars/"):
        avatar_map[str(avatar_id)] = "../../assets/Avatars/" + file
        avatar_id += 1
    with open('./Avatars.json', 'w', encoding='utf-8') as file:
        json = json.dump(avatar_map, file, indent = 4)
