from models import db, FoodRating
from app import app
from datetime import datetime
import math


def calculate_scores(current_time):
    '''
    We use a simple linear model --> W(t) = 1 - abs(t - tc)
        Tc = current time
        T = time the rating was submitted

    Score: (sum of all W(t) * score) / (sum of all W(t))
    '''
    with app.app_context():
        ratings = FoodRating.query.all()
        diff_foods_dict = {}
        each_entry_score = []

        class food_entry_nws:
            def __init__(self, name, weight, score):
                self.name = name
                self.weight = weight
                self.score = score

        for rating in ratings:
            time_diff = abs((rating.time_submitted - current_time).total_seconds()) / 3600
            if (time_diff) < 1:
                weight = 1 - time_diff
                score = rating.rating
                each_entry_score.append(food_entry_nws(rating.food_name, weight, score))
                diff_foods_dict[rating.food_name] = 1

        for food in diff_foods_dict.keys():
            total_weight = 0
            total_sxweight = 0      
            for entry in each_entry_score:

                if entry.name == food:
                    total_sxweight += entry.score * entry.weight
                    total_weight += entry.weight
            
            diff_foods_dict[food] = total_sxweight / total_weight
        
        return diff_foods_dict