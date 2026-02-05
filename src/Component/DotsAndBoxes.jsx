
// import React, { useState, useEffect } from "react";
// import { Box, Typography, Button, Slider, Paper, useTheme, useMediaQuery } from "@mui/material";

// const DotsAndBoxes = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const [gridSize, setGridSize] = useState(isMobile ? 5 : 6);
//   const [lines, setLines] = useState({});
//   const [boxes, setBoxes] = useState({});
//   const [currentPlayer, setCurrentPlayer] = useState("A");
//   const [score, setScore] = useState({ A: 0, B: 0 });
//   const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

//   // 1. Precise Viewport Tracking
//   useEffect(() => {
//     const handleResize = () => {
//       // Calculate available space specifically
//       const headerHeight = 160; // Approximate height for scores/slider
//       const footerHeight = 80;  // Approximate height for reset button
//       const padding = 40;

//       const availableWidth = window.innerWidth - padding;
//       const availableHeight = window.innerHeight - headerHeight - footerHeight - padding;
      
//       // The board must be square, so take the smaller of the two dimensions
//       const size = Math.min(availableWidth, availableHeight, 500); 
//       setDimensions({ width: size, height: size });
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const resetGame = (newSize = gridSize) => {
//     setGridSize(newSize);
//     setLines({});
//     setBoxes({});
//     setScore({ A: 0, B: 0 });
//     setCurrentPlayer("A");
//   };

//   const handleLineClick = (r, c, dir) => {
//     const key = `${r}-${c}-${dir}`;
//     if (lines[key]) return;

//     const newLines = { ...lines, [key]: currentPlayer };
//     setLines(newLines);

//     let boxesFound = 0;
//     let newBoxes = { ...boxes };
//     let newScore = { ...score };

//     const potentialBoxes = dir === 'h' ? [[r - 1, c], [r, c]] : [[r, c - 1], [r, c]];

//     potentialBoxes.forEach(([br, bc]) => {
//       if (br >= 0 && br < gridSize - 1 && bc >= 0 && bc < gridSize - 1) {
//         if (newLines[`${br}-${bc}-h`] && newLines[`${br + 1}-${bc}-h`] && 
//             newLines[`${br}-${bc}-v`] && newLines[`${br}-${bc + 1}-v`] && !newBoxes[`${br}-${bc}`]) {
//           newBoxes[`${br}-${bc}`] = currentPlayer;
//           newScore[currentPlayer]++;
//           boxesFound++;
//         }
//       }
//     });

//     if (boxesFound > 0) {
//       setBoxes(newBoxes);
//       setScore(newScore);
//     } else {
//       setCurrentPlayer(currentPlayer === "A" ? "B" : "A");
//     }
//   };

//   // Dynamic Scale
//   const cellSize = dimensions.width / (gridSize - 0.9);
//   const dotSize = Math.max(6, cellSize * 0.12);
//   const strokeWidth = Math.max(4, cellSize * 0.08);

//   return (
//     <Box sx={{ 
//       overflow: 'hidden',
//       display: 'flex',
//       flexDirection: 'column',
//       bgcolor: '#121212', // Dark theme often looks cleaner for games
//       color: 'white',
//       p: 1
//     }}>
//       {/* Header Area */}
//       <Box sx={{ flexShrink: 0, textAlign: 'center', py: 1 }}>
//         <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: 2 }}>
//           DOTS & BOXES
//         </Typography>
        
//         <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 1 }}>
//           <ScoreTile label="A" score={score.A} active={currentPlayer === 'A'} color="#4dabf5" />
//           <ScoreTile label="B" score={score.B} active={currentPlayer === 'B'} color="#ff5252" />
//         </Box>

//         <Box sx={{ width: '200px', mx: 'auto' }}>
//           <Slider 
//             size="small"
//             value={gridSize} 
//             min={3} max={isMobile ? 6 : 10} 
//             onChange={(_, v) => resetGame(v)}
//             sx={{ color: '#666' }}
//           />
//         </Box>
//       </Box>

//       {/* Board Area */}
//       <Box sx={{ 
//         flexGrow: 1, 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'center',
//         touchAction: 'none'
//       }}>
//         <Box sx={{ 
//           position: 'relative', 
//           width: dimensions.width, 
//           height: dimensions.height,
//         }}>
//           {/* Fillable Boxes */}
//           {Array.from({ length: gridSize - 1 }).map((_, r) => (
//             Array.from({ length: gridSize - 1 }).map((_, c) => (
//               <Box key={`box-${r}-${c}`} sx={{
//                 position: 'absolute',
//                 top: r * cellSize + dotSize/2,
//                 left: c * cellSize + dotSize/2,
//                 width: cellSize,
//                 height: cellSize,
//                 bgcolor: boxes[`${r}-${c}`] === "A" ? "rgba(77, 171, 245, 0.2)" : 
//                          boxes[`${r}-${c}`] === "B" ? "rgba(255, 82, 82, 0.2)" : "transparent",
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 transition: 'all 0.3s'
//               }}>
//                 <Typography sx={{ fontSize: cellSize * 0.5, fontWeight: 'bold', opacity: 0.8 }}>
//                   {boxes[`${r}-${c}`]}
//                 </Typography>
//               </Box>
//             ))
//           ))}

//           {/* Lines and Dots */}
//           {Array.from({ length: gridSize }).map((_, r) => (
//             Array.from({ length: gridSize }).map((_, c) => (
//               <React.Fragment key={`cell-${r}-${c}`}>
//                 {c < gridSize - 1 && (
//                   <Box
//                     onClick={() => handleLineClick(r, c, "h")}
//                     sx={{
//                       position: 'absolute',
//                       top: r * cellSize + (dotSize / 2 - strokeWidth / 2),
//                       left: c * cellSize + dotSize,
//                       width: cellSize - dotSize,
//                       height: strokeWidth,
//                       bgcolor: lines[`${r}-${c}-h`] ? (lines[`${r}-${c}-h`] === 'A' ? '#4dabf5' : '#ff5252') : "#333",
//                       cursor: "pointer", borderRadius: 4, zIndex: 2
//                     }}
//                   />
//                 )}
//                 {r < gridSize - 1 && (
//                   <Box
//                     onClick={() => handleLineClick(r, c, "v")}
//                     sx={{
//                       position: 'absolute',
//                       top: r * cellSize + dotSize,
//                       left: c * cellSize + (dotSize / 2 - strokeWidth / 2),
//                       width: strokeWidth,
//                       height: cellSize - dotSize,
//                       bgcolor: lines[`${r}-${c}-v`] ? (lines[`${r}-${c}-v`] === 'A' ? '#4dabf5' : '#ff5252') : "#333",
//                       cursor: "pointer", borderRadius: 4, zIndex: 2
//                     }}
//                   />
//                 )}
//                 <Box sx={{
//                   position: 'absolute',
//                   top: r * cellSize,
//                   left: c * cellSize,
//                   width: dotSize,
//                   height: dotSize,
//                   bgcolor: "#fff",
//                   borderRadius: "50%",
//                   zIndex: 3,
//                   boxShadow: '0 0 5px rgba(255,255,255,0.5)'
//                 }} />
//               </React.Fragment>
//             ))
//           ))}
//         </Box>
//       </Box>

//       {/* Footer */}
//       <Box sx={{ flexShrink: 0, pb: 2, pt:1,textAlign: 'center' }}>
//         <Button 
//           variant="outlined" 
//           onClick={() => resetGame()} 
//           sx={{ borderColor: '#444', color: '#aaa', borderRadius: '20px' }}
//         >
//           Reset Match
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// const ScoreTile = ({ label, score, active, color }) => (
//   <Paper sx={{
//     px: 4, py: 1, borderRadius: 2,
//     bgcolor: active ? color : '#222',
//     color: active ? '#000' : '#888',
//     transition: 'all 0.3s'
//   }}>
//     <Typography variant="caption" fontWeight="bold">PLAYER {label}</Typography>
//     <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1 }}>{score}</Typography>
//   </Paper>
// );

// export default DotsAndBoxes;

import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Slider, Paper, TextField, useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const DotsAndBoxes = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Game State
  const [stage, setStage] = useState("setup"); // 'setup' or 'playing'
  const [playerNames, setPlayerNames] = useState({ A: "Player 1", B: "Player 2" });
  const [gridSize, setGridSize] = useState(isMobile ? 4 : 5);
  const [lines, setLines] = useState({});
  const [boxes, setBoxes] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState("A");
  const [score, setScore] = useState({ A: 0, B: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [winner, setWinner] = useState(null);

  const totalBoxes = (gridSize - 1) ** 2;

  // Viewport Tracking
  useEffect(() => {
    const handleResize = () => {
      const padding = 60;
      const size = Math.min(window.innerWidth - padding, window.innerHeight - 300, 500);
      setDimensions({ width: size, height: size });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resetGame = (newSize = gridSize) => {
    setLines({});
    setBoxes({});
    setScore({ A: 0, B: 0 });
    setCurrentPlayer("A");
    setWinner(null);
    if (newSize !== gridSize) setGridSize(newSize);
  };

  const handleLineClick = (r, c, dir) => {
    if (winner) return;
    const key = `${r}-${c}-${dir}`;
    if (lines[key]) return;

    const newLines = { ...lines, [key]: currentPlayer };
    setLines(newLines);

    let boxesFound = 0;
    let newBoxes = { ...boxes };
    let newScore = { ...score };

    const potentialBoxes = dir === 'h' ? [[r - 1, c], [r, c]] : [[r, c - 1], [r, c]];

    potentialBoxes.forEach(([br, bc]) => {
      if (br >= 0 && br < gridSize - 1 && bc >= 0 && bc < gridSize - 1) {
        if (newLines[`${br}-${bc}-h`] && newLines[`${br + 1}-${bc}-h`] && 
            newLines[`${br}-${bc}-v`] && newLines[`${br}-${bc + 1}-v`] && !newBoxes[`${br}-${bc}`]) {
          newBoxes[`${br}-${bc}`] = currentPlayer;
          newScore[currentPlayer]++;
          boxesFound++;
        }
      }
    });

    if (boxesFound > 0) {
      setBoxes(newBoxes);
      setScore(newScore);
      // Check for winner
      if (newScore.A + newScore.B === totalBoxes) {
        if (newScore.A > newScore.B) setWinner(playerNames.A);
        else if (newScore.B > newScore.A) setWinner(playerNames.B);
        else setWinner("Draw");
      }
    } else {
      setCurrentPlayer(currentPlayer === "A" ? "B" : "A");
    }
  };

  const cellSize = dimensions.width / (gridSize - 0.9);
  const dotSize = Math.max(6, cellSize * 0.12);
  const strokeWidth = Math.max(4, cellSize * 0.08);

  // --- SETUP SCREEN ---
  if (stage === "setup") {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#121212', p: 3 }}>
        <Paper elevation={10} sx={{ p: 4, width: '100%', maxWidth: 400, bgcolor: '#1e1e1e', color: 'white', textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h4" fontWeight="900" mb={3}>GET STARTED</Typography>
          <TextField 
            fullWidth label="Player 1 Name" variant="filled" margin="normal"
            value={playerNames.A} onChange={(e) => setPlayerNames({...playerNames, A: e.target.value})}
            sx={{ bgcolor: '#333', borderRadius: 1, input: { color: 'white' }, label: { color: '#aaa' } }}
          />
          <TextField 
            fullWidth label="Player 2 Name" variant="filled" margin="normal"
            value={playerNames.B} onChange={(e) => setPlayerNames({...playerNames, B: e.target.value})}
            sx={{ bgcolor: '#333', borderRadius: 1, input: { color: 'white' }, label: { color: '#aaa' } }}
          />
          <Box mt={3}>
            <Typography variant="caption" color="#aaa">Grid Size: {gridSize}x{gridSize}</Typography>
            <Slider value={gridSize} min={3} max={8} onChange={(_, v) => setGridSize(v)} sx={{ color: '#4dabf5' }} />
          </Box>
          <Button 
            fullWidth variant="contained" size="large" sx={{ mt: 4, py: 1.5, fontWeight: 'bold' }}
            onClick={() => setStage("playing")}
          >
            START GAME
          </Button>
        </Paper>
      </Box>
    );
  }

  // --- GAME BOARD SCREEN ---
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#121212', color: 'white', overflow: 'hidden' }}>
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ opacity: 0.6 }}>DOTS & BOXES</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 2 }}>
          <ScoreTile name={playerNames.A} score={score.A} active={currentPlayer === 'A'} color="#4dabf5" />
          <ScoreTile name={playerNames.B} score={score.B} active={currentPlayer === 'B'} color="#ff5252" />
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'none' }}>
        <Box sx={{ position: 'relative', width: dimensions.width, height: dimensions.height }}>
          {/* Boxes */}
          {Array.from({ length: gridSize - 1 }).map((_, r) => (
            Array.from({ length: gridSize - 1 }).map((_, c) => (
              <Box key={`box-${r}-${c}`} sx={{
                position: 'absolute', top: r * cellSize + dotSize/2, left: c * cellSize + dotSize/2,
                width: cellSize, height: cellSize,
                bgcolor: boxes[`${r}-${c}`] === "A" ? "rgba(77, 171, 245, 0.2)" : 
                         boxes[`${r}-${c}`] === "B" ? "rgba(255, 82, 82, 0.2)" : "transparent",
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s'
              }}>
                <Typography sx={{ fontSize: cellSize * 0.4, fontWeight: 'bold', opacity: 0.8 }}>
                  {boxes[`${r}-${c}`]}
                </Typography>
              </Box>
            ))
          ))}

          {/* Lines & Dots */}
          {Array.from({ length: gridSize }).map((_, r) => (
            Array.from({ length: gridSize }).map((_, c) => (
              <React.Fragment key={`cell-${r}-${c}`}>
                {c < gridSize - 1 && (
                  <Box onClick={() => handleLineClick(r, c, "h")} sx={{
                    position: 'absolute', top: r * cellSize + (dotSize / 2 - strokeWidth / 2),
                    left: c * cellSize + dotSize, width: cellSize - dotSize, height: strokeWidth,
                    bgcolor: lines[`${r}-${c}-h`] ? (lines[`${r}-${c}-h`] === 'A' ? '#4dabf5' : '#ff5252') : "#333",
                    cursor: "pointer", borderRadius: 4, zIndex: 2, '&:hover': { bgcolor: !lines[`${r}-${c}-h`] && '#444' }
                  }} />
                )}
                {r < gridSize - 1 && (
                  <Box onClick={() => handleLineClick(r, c, "v")} sx={{
                    position: 'absolute', top: r * cellSize + dotSize,
                    left: c * cellSize + (dotSize / 2 - strokeWidth / 2),
                    width: strokeWidth, height: cellSize - dotSize,
                    bgcolor: lines[`${r}-${c}-v`] ? (lines[`${r}-${c}-v`] === 'A' ? '#4dabf5' : '#ff5252') : "#333",
                    cursor: "pointer", borderRadius: 4, zIndex: 2, '&:hover': { bgcolor: !lines[`${r}-${c}-v`] && '#444' }
                  }} />
                )}
                <Box sx={{
                  position: 'absolute', top: r * cellSize, left: c * cellSize,
                  width: dotSize, height: dotSize, bgcolor: "#fff", borderRadius: "50%", zIndex: 3
                }} />
              </React.Fragment>
            ))
          ))}
        </Box>
      </Box>

      <Box sx={{ py: 3, textAlign: 'center' }}>
        <Button variant="text" onClick={() => setStage("setup")} sx={{ color: '#666', mr: 2 }}>Edit Names</Button>
        <Button variant="outlined" onClick={() => resetGame()} sx={{ borderColor: '#444', color: '#aaa' }}>Reset Match</Button>
      </Box>

      {/* Winner Dialog */}
      <Dialog open={!!winner} PaperProps={{ sx: { bgcolor: '#1e1e1e', color: 'white', borderRadius: 4, textAlign: 'center', p: 2 } }}>
        <DialogTitle sx={{ fontSize: '2rem', fontWeight: '900' }}>
          {winner === "Draw" ? "IT'S A TIE!" : "VICTORY!"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h5">
            {winner === "Draw" ? "Well played both!" : `${winner} wins the match!`}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, opacity: 0.7 }}>
            Final Score: {score.A} - {score.B}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button variant="contained" onClick={() => resetGame()} sx={{ px: 4, py: 1, fontWeight: 'bold' }}>PLAY AGAIN</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const ScoreTile = ({ name, score, active, color }) => (
  <Paper sx={{
    px: 3, py: 1, borderRadius: 2, textAlign: 'center',
    bgcolor: active ? color : '#222',
    color: active ? '#000' : '#888',
    transition: 'all 0.3s', minWidth: 100
  }}>
    <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>{name}</Typography>
    <Typography variant="h5" fontWeight="bold">{score}</Typography>
  </Paper>
);

export default DotsAndBoxes;