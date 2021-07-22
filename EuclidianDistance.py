from typing import Dict, Tuple, Optional


def calculate(attributes: Dict[str, Tuple[Optional[int], Optional[int]]]) -> float:
    """
    Get the Euclidian distance between all values in attributes
    :param attributes: a dictionary of attributes of two users, where each attribute maps to a tuple of values
    corresponding to each user in consistent order (u_1, u_2)
    :return: the euclidian distance between the two individuals
    """
    diff = []
    for pair in attributes.values():
        p = pair[0]
        q = pair[1]
        if p is not None and q is not None:
            diff.append((q-p)**2)
    return sum(diff)**0.5


if __name__ == "__main__":
    print(calculate({"a1": (0, 7), "a2": (3, 6), "a3": (4, 3), "a4": (5, -1)}))
