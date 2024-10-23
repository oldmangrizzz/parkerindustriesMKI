import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import EnhancedChatInterface from './EnhancedChatInterface';
import ComponentWindow from './ComponentWindow';
import ParticleBackground from './ParticleBackground';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Create a theme with industrial metal and wood aesthetics
const theme = createTheme({
  palette: {
    primary: {
      main: '#78909c', // Metallic blue-grey
    },
    secondary: {
      main: '#8d6e63', // Wood brown
    },
    background: {
      default: '#37474f', // Dark industrial grey
      paper: '#455a64', // Lighter industrial grey
    },
    text: {
      primary: '#eceff1', // Light text for contrast
      secondary: '#b0bec5', // Softer light text
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Square buttons for industrial look
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'url("/metal-texture.jpg")', // Add a subtle metal texture
          backgroundBlendMode: 'overlay',
        },
      },
    },
  },
});

const AppContainer = styled(animated.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled(motion.header)`
  background: rgba(55, 71, 79, 0.8);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MainContent = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

interface ComponentType {
  id: string;
  name: string;
}

const EnhancedApp: React.FC = () => {
  const [components, setComponents] = useState<ComponentType[]>([
    { id: 'chat', name: 'Chat' },
    { id: 'map', name: 'Map' },
    { id: 'vfusion3d', name: 'VFusion3D' },
    { id: 'audio', name: 'Audio' },
    { id: 'code', name: 'Code' },
    { id: 'swarm', name: 'Swarm' },
    { id: 'memory', name: 'Memory' },
    { id: 'performance', name: 'Performance' },
  ]);
  const [layout, setLayout] = useState<Layout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    // Initialize layout
    setLayout(components.map((comp, i) => ({
      i: comp.id,
      x: i % 3 * 4,
      y: Math.floor(i / 3) * 4,
      w: 4,
      h: 4,
      minW: 2,
      minH: 2,
    })));
  }, []);

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newComponents = Array.from(components);
    const [reorderedItem] = newComponents.splice(result.source.index, 1);
    newComponents.splice(result.destination.index, 0, reorderedItem);
    setComponents(newComponents);
  };

  const backgroundSpring = useSpring({
    from: { background: 'linear-gradient(45deg, #263238 0%, #37474f 100%)' },
    to: async (next) => {
      while (true) {
        await next({ background: 'linear-gradient(45deg, #37474f 0%, #263238 100%)' });
        await next({ background: 'linear-gradient(45deg, #263238 0%, #37474f 100%)' });
      }
    },
    config: { duration: 5000 },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContainer style={backgroundSpring}>
        <ParticleBackground />
        <Header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1>Parker Industries AI Interface</h1>
          </div>
        </Header>
        <MainContent>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="components">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <ResponsiveGridLayout
                    className="layout"
                    layouts={{ lg: layout }}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    onLayoutChange={handleLayoutChange}
                    isDraggable
                    isResizable
                  >
                    {components.map((component, index) => (
                      <div key={component.id}>
                        <Draggable draggableId={component.id} index={index}>
                          {(provided) => (
                            <ComponentWindow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              title={component.name}
                            >
                              {component.id === 'chat' ? (
                                <EnhancedChatInterface transcript={transcript} resetTranscript={resetTranscript} />
                              ) : (
                                <p>Content for {component.name}</p>
                              )}
                            </ComponentWindow>
                          )}
                        </Draggable>
                      </div>
                    ))}
                  </ResponsiveGridLayout>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </MainContent>
        <AnimatePresence>
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
        </AnimatePresence>
      </AppContainer>
    </ThemeProvider>
  );
};

export default EnhancedApp;
