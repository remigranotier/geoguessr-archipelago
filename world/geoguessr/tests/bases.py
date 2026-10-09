from test.bases import WorldTestBase
from worlds.geoguessr import GeoguessrWorld


class GeoguessrTestBase(WorldTestBase):
    game = 'Geoguessr'
    world = GeoguessrWorld