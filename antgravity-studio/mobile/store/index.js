import { configureStore, createSlice } from '@reduxjs/toolkit';

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setProjects: (state, action) => {
      state.items = action.payload;
    },
    addProject: (state, action) => {
      state.items.unshift(action.payload);
    },
    removeProject: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

const videoSlice = createSlice({
  name: 'videos',
  initialState: {
    items: [],
    currentVideo: null,
    generating: false,
  },
  reducers: {
    setVideos: (state, action) => {
      state.items = action.payload;
    },
    setCurrentVideo: (state, action) => {
      state.currentVideo = action.payload;
    },
    setGenerating: (state, action) => {
      state.generating = action.payload;
    },
  },
});

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: true,
    activeTab: 'Home',
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setProjects, addProject, removeProject, setLoading: setProjectLoading } = projectSlice.actions;
export const { setVideos, setCurrentVideo, setGenerating } = videoSlice.actions;
export const { toggleDarkMode, setActiveTab } = uiSlice.actions;

export const store = configureStore({
  reducer: {
    projects: projectSlice.reducer,
    videos: videoSlice.reducer,
    ui: uiSlice.reducer,
  },
});
