// import React, { useState, useEffect } from "react";
// import { Box, Typography, Button, Paper, Slider, Divider, useTheme, useMediaQuery } from "@mui/material";

// const DotsAndBoxes = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isTablet = useMediaQuery(theme.breakpoints.down("md"));

//   // Set limits based on device
//   const MAX_GRID = isMobile ? 6 : isTablet ? 10 : 12;
  
//   const [gridSize, setGridSize] = useState(isMobile ? 5 : 6);
//   const [lines, setLines] = useState({});
//   const [boxes, setBoxes] = useState({});
//   const [currentPlayer, setCurrentPlayer] = useState("A");
//   const [score, setScore] = useState({ A: 0, B: 0 });

//   // Reset game when grid size changes
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
//         const top = newLines[`${br}-${bc}-h`];
//         const bottom = newLines[`${br + 1}-${bc}-h`];
//         const left = newLines[`${br}-${bc}-v`];
//         const right = newLines[`${br}-${bc + 1}-v`];

//         if (top && bottom && left && right && !newBoxes[`${br}-${bc}`]) {
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

//   // UI Scaling Logic
//   const boardPadding = 40;
//   const availableWidth = isMobile ? window.innerWidth - boardPadding : 500;
//   const cellSize = availableWidth / gridSize;
//   const dotSize = Math.max(8, cellSize * 0.15);
//   const strokeWidth = Math.max(4, cellSize * 0.08);

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "#f0f2f5", p: { xs: 1, sm: 3 }, display: 'flex', justifyContent: 'center' }}>
//       <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, width: '100%', maxWidth: 600, textAlign: 'center' }}>
        
//         <Typography variant="h4" fontWeight="900" sx={{ color: '#1a237e', mb: 1 }}>
//           DOTS & BOXES
//         </Typography>

//         {/* Dynamic Controls */}
//         <Box sx={{ mb: 3, px: 2 }}>
//           <Typography variant="body2" color="textSecondary" gutterBottom>
//             Adjust Grid Size (Max for your screen: {MAX_GRID})
//           </Typography>
//           <Slider
//             value={gridSize}
//             min={3}
//             max={MAX_GRID}
//             step={1}
//             marks
//             valueLabelDisplay="auto"
//             onChange={(e, val) => resetGame(val)}
//             sx={{ maxWidth: 300, margin: '0 auto' }}
//           />
//         </Box>

//         <Divider sx={{ mb: 3 }} />

//         {/* Scoreboard */}
//         <Box display="flex" justifyContent="center" gap={2} mb={4}>
//           <ScoreCard label="Player A" score={score.A} active={currentPlayer === 'A'} color="#2196f3" />
//           <ScoreCard label="Player B" score={score.B} active={currentPlayer === 'B'} color="#f50057" />
//         </Box>

//         {/* Responsive Game Board */}
//         <Box 
//           sx={{ 
//             position: 'relative', 
//             margin: '0 auto',
//             width: (gridSize - 1) * cellSize + dotSize,
//             height: (gridSize - 1) * cellSize + dotSize,
//             touchAction: 'none' // Prevents scrolling while playing on mobile
//           }}
//         >
//           {/* Boxes */}
//           {Array.from({ length: gridSize - 1 }).map((_, r) => (
//             Array.from({ length: gridSize - 1 }).map((_, c) => (
//               <Box key={`box-${r}-${c}`} sx={{
//                 position: 'absolute',
//                 top: r * cellSize + dotSize / 2,
//                 left: c * cellSize + dotSize / 2,
//                 width: cellSize,
//                 height: cellSize,
//                 bgcolor: boxes[`${r}-${c}`] === "A" ? "#e3f2fd" : boxes[`${r}-${c}`] === "B" ? "#fce4ec" : "transparent",
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 transition: 'all 0.4s ease'
//               }}>
//                 <Typography sx={{ fontWeight: 'bold', fontSize: cellSize * 0.4, opacity: 0.6, color: boxes[`${r}-${c}`] === "A" ? "#2196f3" : "#f50057" }}>
//                   {boxes[`${r}-${c}`]}
//                 </Typography>
//               </Box>
//             ))
//           ))}

//           {/* Grid Interaction Layer */}
//           {Array.from({ length: gridSize }).map((_, r) => (
//             Array.from({ length: gridSize }).map((_, c) => (
//               <React.Fragment key={`cell-${r}-${c}`}>
//                 {/* Horizontal */}
//                 {c < gridSize - 1 && (
//                   <Box
//                     onClick={() => handleLineClick(r, c, "h")}
//                     sx={{
//                       position: 'absolute',
//                       top: r * cellSize + (dotSize / 2 - strokeWidth / 2),
//                       left: c * cellSize + dotSize,
//                       width: cellSize - dotSize,
//                       height: strokeWidth,
//                       bgcolor: lines[`${r}-${c}-h`] ? (lines[`${r}-${c}-h`] === 'A' ? '#2196f3' : '#f50057') : "#e0e0e0",
//                       cursor: "pointer", borderRadius: 2, zIndex: 2,
//                       '&:hover': { bgcolor: !lines[`${r}-${c}-h`] && '#cfd8dc' }
//                     }}
//                   />
//                 )}
//                 {/* Vertical */}
//                 {r < gridSize - 1 && (
//                   <Box
//                     onClick={() => handleLineClick(r, c, "v")}
//                     sx={{
//                       position: 'absolute',
//                       top: r * cellSize + dotSize,
//                       left: c * cellSize + (dotSize / 2 - strokeWidth / 2),
//                       width: strokeWidth,
//                       height: cellSize - dotSize,
//                       bgcolor: lines[`${r}-${c}-v`] ? (lines[`${r}-${c}-v`] === 'A' ? '#2196f3' : '#f50057') : "#e0e0e0",
//                       cursor: "pointer", borderRadius: 2, zIndex: 2,
//                       '&:hover': { bgcolor: !lines[`${r}-${c}-v`] && '#cfd8dc' }
//                     }}
//                   />
//                 )}
//                 {/* Dot */}
//                 <Box sx={{
//                   position: 'absolute',
//                   top: r * cellSize,
//                   left: c * cellSize,
//                   width: dotSize,
//                   height: dotSize,
//                   bgcolor: "#455a64",
//                   borderRadius: "50%",
//                   zIndex: 3
//                 }} />
//               </React.Fragment>
//             ))
//           ))}
//         </Box>

//         <Button 
//           variant="contained" 
//           fullWidth 
//           size="large"
//           onClick={() => resetGame()} 
//           sx={{ mt: 5, borderRadius: 2, py: 1.5, fontWeight: 'bold' }}
//         >
//           Reset Match
//         </Button>
//       </Paper>
//     </Box>
//   );
// };

// // Sub-component for Scoreboard
// const ScoreCard = ({ label, score, active, color }) => (
//   <Box sx={{
//     p: 2, borderRadius: 3, border: `3px solid ${active ? color : '#eee'}`,
//     bgcolor: active ? `${color}10` : 'white',
//     minWidth: 100, transition: 'all 0.3s'
//   }}>
//     <Typography variant="caption" fontWeight="bold" color="textSecondary">{label}</Typography>
//     <Typography variant="h5" fontWeight="900" color={color}>{score}</Typography>
//   </Box>
// );

// export default DotsAndBoxes;

import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Slider, Paper, useTheme, useMediaQuery } from "@mui/material";

const DotsAndBoxes = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [gridSize, setGridSize] = useState(isMobile ? 5 : 6);
  const [lines, setLines] = useState({});
  const [boxes, setBoxes] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState("A");
  const [score, setScore] = useState({ A: 0, B: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 1. Precise Viewport Tracking
  useEffect(() => {
    const handleResize = () => {
      // Calculate available space specifically
      const headerHeight = 160; // Approximate height for scores/slider
      const footerHeight = 80;  // Approximate height for reset button
      const padding = 40;

      const availableWidth = window.innerWidth - padding;
      const availableHeight = window.innerHeight - headerHeight - footerHeight - padding;
      
      // The board must be square, so take the smaller of the two dimensions
      const size = Math.min(availableWidth, availableHeight, 500); 
      setDimensions({ width: size, height: size });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resetGame = (newSize = gridSize) => {
    setGridSize(newSize);
    setLines({});
    setBoxes({});
    setScore({ A: 0, B: 0 });
    setCurrentPlayer("A");
  };

  const handleLineClick = (r, c, dir) => {
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
    } else {
      setCurrentPlayer(currentPlayer === "A" ? "B" : "A");
    }
  };

  // Dynamic Scale
  const cellSize = dimensions.width / (gridSize - 0.9);
  const dotSize = Math.max(6, cellSize * 0.12);
  const strokeWidth = Math.max(4, cellSize * 0.08);

  return (
    <Box sx={{ 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#121212', // Dark theme often looks cleaner for games
      color: 'white',
      p: 1
    }}>
      {/* Header Area */}
      <Box sx={{ flexShrink: 0, textAlign: 'center', py: 1 }}>
        <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: 2 }}>
          DOTS & BOXES
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 1 }}>
          <ScoreTile label="A" score={score.A} active={currentPlayer === 'A'} color="#4dabf5" />
          <ScoreTile label="B" score={score.B} active={currentPlayer === 'B'} color="#ff5252" />
        </Box>

        <Box sx={{ width: '200px', mx: 'auto' }}>
          <Slider 
            size="small"
            value={gridSize} 
            min={3} max={isMobile ? 6 : 10} 
            onChange={(_, v) => resetGame(v)}
            sx={{ color: '#666' }}
          />
        </Box>
      </Box>

      {/* Board Area */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        touchAction: 'none'
      }}>
        <Box sx={{ 
          position: 'relative', 
          width: dimensions.width, 
          height: dimensions.height,
        }}>
          {/* Fillable Boxes */}
          {Array.from({ length: gridSize - 1 }).map((_, r) => (
            Array.from({ length: gridSize - 1 }).map((_, c) => (
              <Box key={`box-${r}-${c}`} sx={{
                position: 'absolute',
                top: r * cellSize + dotSize/2,
                left: c * cellSize + dotSize/2,
                width: cellSize,
                height: cellSize,
                bgcolor: boxes[`${r}-${c}`] === "A" ? "rgba(77, 171, 245, 0.2)" : 
                         boxes[`${r}-${c}`] === "B" ? "rgba(255, 82, 82, 0.2)" : "transparent",
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s'
              }}>
                <Typography sx={{ fontSize: cellSize * 0.5, fontWeight: 'bold', opacity: 0.8 }}>
                  {boxes[`${r}-${c}`]}
                </Typography>
              </Box>
            ))
          ))}

          {/* Lines and Dots */}
          {Array.from({ length: gridSize }).map((_, r) => (
            Array.from({ length: gridSize }).map((_, c) => (
              <React.Fragment key={`cell-${r}-${c}`}>
                {c < gridSize - 1 && (
                  <Box
                    onClick={() => handleLineClick(r, c, "h")}
                    sx={{
                      position: 'absolute',
                      top: r * cellSize + (dotSize / 2 - strokeWidth / 2),
                      left: c * cellSize + dotSize,
                      width: cellSize - dotSize,
                      height: strokeWidth,
                      bgcolor: lines[`${r}-${c}-h`] ? (lines[`${r}-${c}-h`] === 'A' ? '#4dabf5' : '#ff5252') : "#333",
                      cursor: "pointer", borderRadius: 4, zIndex: 2
                    }}
                  />
                )}
                {r < gridSize - 1 && (
                  <Box
                    onClick={() => handleLineClick(r, c, "v")}
                    sx={{
                      position: 'absolute',
                      top: r * cellSize + dotSize,
                      left: c * cellSize + (dotSize / 2 - strokeWidth / 2),
                      width: strokeWidth,
                      height: cellSize - dotSize,
                      bgcolor: lines[`${r}-${c}-v`] ? (lines[`${r}-${c}-v`] === 'A' ? '#4dabf5' : '#ff5252') : "#333",
                      cursor: "pointer", borderRadius: 4, zIndex: 2
                    }}
                  />
                )}
                <Box sx={{
                  position: 'absolute',
                  top: r * cellSize,
                  left: c * cellSize,
                  width: dotSize,
                  height: dotSize,
                  bgcolor: "#fff",
                  borderRadius: "50%",
                  zIndex: 3,
                  boxShadow: '0 0 5px rgba(255,255,255,0.5)'
                }} />
              </React.Fragment>
            ))
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ flexShrink: 0, pb: 2, pt:1,textAlign: 'center' }}>
        <Button 
          variant="outlined" 
          onClick={() => resetGame()} 
          sx={{ borderColor: '#444', color: '#aaa', borderRadius: '20px' }}
        >
          Reset Match
        </Button>
      </Box>
    </Box>
  );
};

const ScoreTile = ({ label, score, active, color }) => (
  <Paper sx={{
    px: 4, py: 1, borderRadius: 2,
    bgcolor: active ? color : '#222',
    color: active ? '#000' : '#888',
    transition: 'all 0.3s'
  }}>
    <Typography variant="caption" fontWeight="bold">PLAYER {label}</Typography>
    <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1 }}>{score}</Typography>
  </Paper>
);

export default DotsAndBoxes;