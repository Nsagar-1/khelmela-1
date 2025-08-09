import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { FaCalendarAlt, FaFilter, FaSearch, FaUsers } from "react-icons/fa";
import { useState } from "react";
import { Tournament } from "@shared/schema";

const Tournaments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: tournaments = [], isLoading } = useQuery<Tournament[]>({
    queryKey: ['/api/tournaments'],
  });

  const filteredTournaments = tournaments.filter((tournament: Tournament) => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || tournament.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: "All Games" },
    { id: "free-fire", name: "Free Fire" },
    { id: "pubg", name: "PUBG" },
    { id: "pubg-mobile", name: "PUBG Mobile" },
    { id: "cod", name: "COD (Coming Soon)" },
  ];

  const gameCategories = [
    { id: "all", name: "All Categories" },
    { id: "battle-royale", name: "Battle Royale" },
    { id: "fps", name: "FPS" },
    { id: "mobile", name: "Mobile Games" },
    { id: "esports", name: "Esports" },
  ];

  const tournamentStatuses = [
    { id: "all", name: "All" },
    { id: "upcoming", name: "Upcoming" },
    { id: "live", name: "Live Now" },
    { id: "completed", name: "Completed" },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-rajdhani mb-4">
            Explore <span className="text-secondary">Tournaments</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse through our extensive collection of esports tournaments across various game titles and skill levels.
          </p>
        </div>

        <div className="glass-effect rounded-lg p-6 mb-8 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tournaments..."
                className="pl-10 bg-dark/70 border-gray-700 text-white w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-secondary" />
              <span className="text-white font-rajdhani">Filters:</span>
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:text-white">
                Prize Pool <span className="text-xs ml-1">▼</span>
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:text-white">
                Date <span className="text-xs ml-1">▼</span>
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:text-white">
                Team Size <span className="text-xs ml-1">▼</span>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6 bg-dark/40">
              <TabsTrigger value="categories" className="font-rajdhani font-semibold">Game Categories</TabsTrigger>
              <TabsTrigger value="games" className="font-rajdhani font-semibold">Specific Games</TabsTrigger>
              <TabsTrigger value="status" className="font-rajdhani font-semibold">Tournament Status</TabsTrigger>
            </TabsList>
            <TabsContent value="categories">
              <div className="flex flex-wrap gap-3 justify-center">
                {gameCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className={`rounded-full py-2 px-5 font-rajdhani font-semibold ${
                      activeCategory === category.id
                        ? "bg-primary/30 text-white"
                        : "bg-dark/60 text-white hover:bg-primary/30"
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="games">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className={`rounded-full py-2 px-5 font-rajdhani font-semibold ${
                      activeCategory === category.id
                        ? "bg-primary/30 text-white"
                        : "bg-dark/60 text-white hover:bg-primary/30"
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="status">
              <div className="flex flex-wrap gap-3 justify-center">
                {tournamentStatuses.map((status) => (
                  <Button
                    key={status.id}
                    variant="ghost"
                    className={`rounded-full py-2 px-5 font-rajdhani font-semibold ${
                      activeCategory === status.id
                        ? "bg-primary/30 text-white"
                        : "bg-dark/60 text-white hover:bg-primary/30"
                    }`}
                    onClick={() => setActiveCategory(status.id)}
                  >
                    {status.name}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="bg-dark/60 border-gray-800 rounded-xl">
                <div className="h-48 bg-gray-800 animate-pulse rounded-t-xl"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-800 animate-pulse rounded-md mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-800 animate-pulse rounded-md mb-4 w-1/2"></div>
                  <div className="h-2 bg-gray-800 animate-pulse rounded-md mb-4 w-full"></div>
                  <div className="flex gap-3">
                    <div className="h-10 bg-gray-800 animate-pulse rounded-md flex-1"></div>
                    <div className="h-10 bg-gray-800 animate-pulse rounded-md flex-1"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTournaments.map((tournament) => (
              <div key={tournament.id} className="tournament-card bg-dark/60 rounded-xl overflow-hidden border border-gray-800 hover:shadow-[0_0_10px_rgba(110,43,241,0.5),_0_0_20px_rgba(110,43,241,0.3)] transition-all hover:-translate-y-1 group relative">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={tournament.image} 
                    alt={tournament.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
                  
                  {tournament.status === 'live' && (
                    <div className="absolute top-4 left-4 bg-green-500/90 text-white text-xs font-bold py-1 px-3 rounded-full flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span> Live Now
                    </div>
                  )}
                  
                  {tournament.status === 'upcoming' && (
                    <div className="absolute top-4 left-4 bg-amber-400/90 text-dark text-xs font-bold py-1 px-3 rounded-full flex items-center">
                      Coming Soon
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4 bg-primary/90 text-white text-xs font-bold py-1 px-3 rounded-full">
                    {tournament.game}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold font-rajdhani text-white">{tournament.name}</h3>
                    <span className="text-secondary font-orbitron text-sm">{tournament.teamSize}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-400 text-sm mb-4">
                    <FaCalendarAlt className="mr-2" /> {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center w-full">
                      <div className="bg-gray-700 h-2 w-full rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary h-full rounded-full" 
                          style={{width: `${(tournament.registeredTeams / tournament.maxTeams) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm ml-3">
                      {tournament.registeredTeams}/{tournament.maxTeams} Teams
                    </span>
                  </div>
                  
                  <div className="flex justify-center">
                    {tournament.registeredTeams < tournament.maxTeams ? (
                      <Button className="bg-primary hover:bg-primary/90 text-white text-center py-2 px-3 rounded-md transition-all font-rajdhani font-bold w-full h-auto">
                        Register Team
                      </Button>
                    ) : (
                      <Button disabled className="bg-gray-700 text-gray-400 cursor-not-allowed text-center py-2 px-3 rounded-md font-rajdhani font-bold w-full h-auto">
                        Full
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="bg-dark/60 border-gray-800 p-8 text-center">
            <CardHeader>
              <CardTitle className="font-rajdhani text-2xl">No tournaments found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-6">
                No tournaments matching your search criteria were found. Try adjusting your filters or search query.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {filteredTournaments.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-800 bg-dark/60 hover:bg-dark/80 text-gray-400">
                Previous
              </Button>
              <Button variant="outline" className="border-gray-800 bg-primary/20 text-white">
                1
              </Button>
              <Button variant="outline" className="border-gray-800 bg-dark/60 hover:bg-dark/80 text-gray-400">
                2
              </Button>
              <Button variant="outline" className="border-gray-800 bg-dark/60 hover:bg-dark/80 text-gray-400">
                3
              </Button>
              <Button variant="outline" className="border-gray-800 bg-dark/60 hover:bg-dark/80 text-gray-400">
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;
