import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  Trophy,
  Users,
  Gamepad2,
  Map,
  DollarSign,
  Calendar,
  PenTool,
  User,
  Loader2,
  Shield,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TournamentDetail = () => {
  const { id } = useParams();
  
  const { data: tournament, isLoading, error } = useQuery({
    queryKey: [`/api/tournaments/${id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-gray-400 font-rajdhani text-lg">Loading tournament details...</p>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-red-500">Tournament Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-400">The tournament you're looking for doesn't exist or has been removed.</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/tournaments">
                <a>Back to Tournaments</a>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate tournament progress
  const currentDate = new Date();
  const startDate = new Date(tournament.startDate);
  const endDate = new Date(tournament.endDate);
  
  let progress = 0;
  if (currentDate < startDate) {
    progress = 0;
  } else if (currentDate > endDate) {
    progress = 100;
  } else {
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = currentDate.getTime() - startDate.getTime();
    progress = Math.round((elapsed / totalDuration) * 100);
  }

  // Tournament status badge
  const renderStatusBadge = () => {
    switch (tournament.status) {
      case 'live':
        return (
          <Badge className="bg-green-500 text-white font-bold py-1 px-3 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> Live Now
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge className="bg-amber-400 text-dark font-bold py-1 px-3 rounded-full flex items-center">
            Coming Soon
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-gray-500 text-white font-bold py-1 px-3 rounded-full flex items-center">
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-dark/40"
            asChild
          >
            <Link href="/tournaments">
              <a className="flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" /> Back to Tournaments
              </a>
            </Link>
          </Button>
        </div>

        {/* Tournament header */}
        <div className="relative rounded-xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent z-10"></div>
          <img 
            src={tournament.image}
            alt={tournament.name}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {renderStatusBadge()}
                  <Badge className="bg-primary text-white font-bold py-1 px-3 rounded-full">
                    ${tournament.prizePool.toLocaleString()} Prize
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold font-rajdhani text-white mb-2">
                  {tournament.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-300">
                  <div className="flex items-center gap-1">
                    <Gamepad2 className="w-4 h-4" /> {tournament.game}
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" /> {tournament.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {tournament.teamSize}
                  </div>
                  <div className="flex items-center gap-1">
                    <Map className="w-4 h-4" /> {tournament.location || "Online"}
                  </div>
                </div>
              </div>
              <div>
                {tournament.registeredTeams < tournament.maxTeams ? (
                  <Button className="bg-primary hover:bg-primary/90 text-white text-xl px-8 py-6 rounded-md transition-all hover:shadow-[0_0_10px_rgba(110,43,241,0.5),_0_0_20px_rgba(110,43,241,0.3)] font-rajdhani font-bold h-auto">
                    Register Now
                  </Button>
                ) : (
                  <Button disabled className="bg-gray-700 text-gray-400 cursor-not-allowed text-xl px-8 py-6 rounded-md font-rajdhani font-bold h-auto">
                    Registration Full
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tournament progress */}
        <div className="glass-effect rounded-lg p-6 mb-8 border border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center mb-2">
            <h3 className="text-lg font-bold font-rajdhani text-white mb-2 md:mb-0">Tournament Progress</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Teams:</span>
                <span className="text-white font-bold">{tournament.registeredTeams}/{tournament.maxTeams}</span>
              </div>
              {tournament.entryFee > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Entry Fee:</span>
                  <span className="text-white font-bold">${tournament.entryFee}</span>
                </div>
              )}
            </div>
          </div>
          <div className="mb-1">
            <Progress value={progress} className="h-2 bg-gray-700" />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Registration</span>
            <span>Group Stage</span>
            <span>Playoffs</span>
            <span>Finals</span>
          </div>
        </div>

        {/* Tournament Details Tabs */}
        <Tabs defaultValue="overview" className="mb-12">
          <TabsList className="grid grid-cols-4 w-full mb-8 bg-dark/40">
            <TabsTrigger value="overview" className="font-rajdhani font-semibold">Overview</TabsTrigger>
            <TabsTrigger value="schedule" className="font-rajdhani font-semibold">Schedule</TabsTrigger>
            <TabsTrigger value="teams" className="font-rajdhani font-semibold">Teams</TabsTrigger>
            <TabsTrigger value="rules" className="font-rajdhani font-semibold">Rules</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-dark/60 border-gray-800">
                  <CardHeader>
                    <CardTitle className="font-rajdhani text-2xl text-white">Tournament Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-6">{tournament.description}</p>
                    
                    <h3 className="text-xl font-bold font-rajdhani text-white mb-4">Tournament Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-3 rounded-md">
                          <Trophy className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-1">Prize Pool</h4>
                          <p className="text-secondary font-bold font-orbitron">${tournament.prizePool.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-3 rounded-md">
                          <Gamepad2 className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-1">Game</h4>
                          <p className="text-gray-300">{tournament.game}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-3 rounded-md">
                          <Users className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-1">Team Size</h4>
                          <p className="text-gray-300">{tournament.teamSize}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-3 rounded-md">
                          <Calendar className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-1">Tournament Dates</h4>
                          <p className="text-gray-300">{tournament.date}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-3 rounded-md">
                          <PenTool className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-1">Organizer</h4>
                          <p className="text-gray-300">{tournament.organizer}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-3 rounded-md">
                          <Map className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-1">Location</h4>
                          <p className="text-gray-300">{tournament.location || "Online"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="bg-dark/60 border-gray-800 mb-6">
                  <CardHeader>
                    <CardTitle className="font-rajdhani text-xl text-white">Registration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Registered Teams</span>
                        <span className="text-white font-bold">{tournament.registeredTeams}/{tournament.maxTeams}</span>
                      </div>
                      <div className="bg-gray-700 h-2 w-full rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary h-full rounded-full" 
                          style={{width: `${(tournament.registeredTeams / tournament.maxTeams) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Entry Fee</span>
                        <span className="text-white">${tournament.entryFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Registration Closes</span>
                        <span className="text-white">
                          {new Date(tournament.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    {tournament.registeredTeams < tournament.maxTeams ? (
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white font-rajdhani font-bold py-3">
                        Register Your Team
                      </Button>
                    ) : (
                      <Button disabled className="w-full bg-gray-700 text-gray-400 cursor-not-allowed font-rajdhani font-bold py-3">
                        Registration Full
                      </Button>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-dark/60 border-gray-800">
                  <CardHeader>
                    <CardTitle className="font-rajdhani text-xl text-white">Contact Organizer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center">
                        <User className="text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{tournament.organizer}</h4>
                        <p className="text-gray-400 text-sm">Tournament Organizer</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:text-white hover:bg-dark/80">
                      Contact for Support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card className="bg-dark/60 border-gray-800">
              <CardHeader>
                <CardTitle className="font-rajdhani text-2xl text-white">Tournament Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold font-rajdhani text-white mb-4 flex items-center">
                      <CalendarDays className="mr-2 text-primary" /> Registration Phase
                    </h3>
                    <div className="ml-8 border-l-2 border-gray-800 pl-6 pb-6">
                      <p className="text-gray-300 mb-2">
                        Registration opens: {new Date(tournament.startDate.getTime() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-gray-300">
                        Registration closes: {new Date(tournament.startDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold font-rajdhani text-white mb-4 flex items-center">
                      <CalendarDays className="mr-2 text-primary" /> Group Stage
                    </h3>
                    <div className="ml-8 border-l-2 border-gray-800 pl-6 pb-6">
                      <p className="text-gray-300 mb-2">
                        Start: {new Date(tournament.startDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-gray-300">
                        End: {new Date(new Date(tournament.startDate).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold font-rajdhani text-white mb-4 flex items-center">
                      <CalendarDays className="mr-2 text-primary" /> Playoff Stage
                    </h3>
                    <div className="ml-8 border-l-2 border-gray-800 pl-6 pb-6">
                      <p className="text-gray-300 mb-2">
                        Quarterfinals: {new Date(new Date(tournament.startDate).getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-gray-300">
                        Semifinals: {new Date(new Date(tournament.startDate).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold font-rajdhani text-white mb-4 flex items-center">
                      <Trophy className="mr-2 text-primary" /> Finals
                    </h3>
                    <div className="ml-8 pl-6">
                      <p className="text-gray-300 mb-2">
                        Grand Finals: {new Date(tournament.endDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-gray-300">
                        Prize ceremony will take place immediately after the final match
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Teams Tab */}
          <TabsContent value="teams">
            <Card className="bg-dark/60 border-gray-800">
              <CardHeader>
                <CardTitle className="font-rajdhani text-2xl text-white">Registered Teams</CardTitle>
              </CardHeader>
              <CardContent>
                {tournament.teams && tournament.teams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tournament.teams.map((team) => (
                      <div key={team.id} className="bg-dark/80 rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-all">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center">
                            {team.logo ? (
                              <img src={team.logo} alt={team.name} className="w-10 h-10 rounded-full" />
                            ) : (
                              <Shield className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-white">{team.name}</h4>
                            <p className="text-gray-400 text-sm">Captain: {team.captain}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">Team ID: {team.id}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold font-rajdhani text-white mb-2">No Teams Registered Yet</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-6">
                      Be the first to register your team for this tournament and get ready to compete!
                    </p>
                    <Button className="bg-primary hover:bg-primary/90 text-white font-rajdhani font-bold">
                      Register Your Team
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Rules Tab */}
          <TabsContent value="rules">
            <Card className="bg-dark/60 border-gray-800">
              <CardHeader>
                <CardTitle className="font-rajdhani text-2xl text-white">Tournament Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold font-rajdhani text-white mb-3">General Rules</h3>
                    <ul className="list-disc pl-6 text-gray-300 space-y-2">
                      <li>All players must be registered on the platform at least 24 hours before the tournament begins.</li>
                      <li>Teams must check in 30 minutes before their scheduled match time.</li>
                      <li>All matches will be played on the tournament server with the provided tournament code.</li>
                      <li>Organizers' decisions are final and may not be contested.</li>
                      <li>Unsportsmanlike behavior will result in immediate disqualification.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold font-rajdhani text-white mb-3">Game Specific Rules</h3>
                    <p className="text-gray-300 mb-4">{tournament.rules || "Standard tournament rules apply for this game. Full rulebook will be sent to team captains upon registration."}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold font-rajdhani text-white mb-3">Match Format</h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800">
                          <TableHead className="text-gray-300">Stage</TableHead>
                          <TableHead className="text-gray-300">Format</TableHead>
                          <TableHead className="text-gray-300">Maps</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-gray-800">
                          <TableCell className="font-medium text-white">Group Stage</TableCell>
                          <TableCell className="text-gray-300">Best of 1</TableCell>
                          <TableCell className="text-gray-300">Random Selection</TableCell>
                        </TableRow>
                        <TableRow className="border-gray-800">
                          <TableCell className="font-medium text-white">Quarterfinals</TableCell>
                          <TableCell className="text-gray-300">Best of 3</TableCell>
                          <TableCell className="text-gray-300">Ban/Pick System</TableCell>
                        </TableRow>
                        <TableRow className="border-gray-800">
                          <TableCell className="font-medium text-white">Semifinals</TableCell>
                          <TableCell className="text-gray-300">Best of 3</TableCell>
                          <TableCell className="text-gray-300">Ban/Pick System</TableCell>
                        </TableRow>
                        <TableRow className="border-gray-800">
                          <TableCell className="font-medium text-white">Finals</TableCell>
                          <TableCell className="text-gray-300">Best of 5</TableCell>
                          <TableCell className="text-gray-300">Ban/Pick System</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold font-rajdhani text-white mb-3">Prize Distribution</h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800">
                          <TableHead className="text-gray-300">Position</TableHead>
                          <TableHead className="text-gray-300">Prize</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-gray-800">
                          <TableCell className="font-medium text-white">1st Place</TableCell>
                          <TableCell className="text-secondary font-bold">${Math.round(tournament.prizePool * 0.5).toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow className="border-gray-800">
                          <TableCell className="font-medium text-white">2nd Place</TableCell>
                          <TableCell className="text-secondary font-bold">${Math.round(tournament.prizePool * 0.25).toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow className="border-gray-800">
                          <TableCell className="font-medium text-white">3rd Place</TableCell>
                          <TableCell className="text-secondary font-bold">${Math.round(tournament.prizePool * 0.15).toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow className="border-gray-800">
                          <TableCell className="font-medium text-white">4th Place</TableCell>
                          <TableCell className="text-secondary font-bold">${Math.round(tournament.prizePool * 0.1).toLocaleString()}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Tournaments */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-rajdhani mb-6">Similar <span className="text-secondary">Tournaments</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* We would normally fetch related tournaments here */}
            <Card className="bg-dark/60 border-gray-800 hover:border-primary/50 hover:shadow-[0_0_10px_rgba(110,43,241,0.5),_0_0_20px_rgba(110,43,241,0.3)] transition-all">
              <div className="h-40 bg-gray-800 rounded-t-xl flex items-center justify-center">
                <Gamepad2 className="w-12 h-12 text-gray-600" />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold font-rajdhani text-white mb-1">Similar Tournaments</h3>
                <p className="text-gray-400 text-sm mb-3">Check back later for similar tournaments</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-effect rounded-xl p-8 text-center border border-gray-800">
          <h2 className="text-2xl md:text-3xl font-bold font-rajdhani mb-4">Ready to <span className="text-secondary">Compete</span>?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Join thousands of gamers in this competitive tournament. Register your team now and prepare for battle!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {tournament.registeredTeams < tournament.maxTeams ? (
              <Button className="bg-primary hover:bg-primary/90 text-white font-orbitron py-3 px-8 rounded-md transition-all hover:shadow-[0_0_10px_rgba(110,43,241,0.5),_0_0_20px_rgba(110,43,241,0.3)] transform hover:-translate-y-0.5 text-lg font-bold inline-flex items-center justify-center h-auto">
                Register Your Team <Trophy className="ml-2" />
              </Button>
            ) : (
              <Button disabled className="bg-gray-700 text-gray-400 cursor-not-allowed font-orbitron py-3 px-8 rounded-md text-lg font-bold inline-flex items-center justify-center h-auto">
                Registration Full <Trophy className="ml-2" />
              </Button>
            )}
            <Button variant="outline" className="border-2 border-secondary text-secondary hover:bg-secondary/10 font-orbitron py-3 px-8 rounded-md transition-all hover:shadow-[0_0_10px_rgba(0,209,255,0.5),_0_0_20px_rgba(0,209,255,0.3)] text-lg font-bold inline-flex items-center justify-center h-auto">
              Share Tournament
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;
