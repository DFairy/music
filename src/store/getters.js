import Song from 'common/js/song'

export const singer = state => state.singer
export const playing = state => state.playing //是否播放
export const fullScreen = state => state.fullScreen //全屏
export const playList = state => state.playList //播放列表
export const sequenceList = state => state.sequenceList //顺序
export const mode = state => state.mode //播放模式
export const currentIndex = state => state.currentIndex //当前播放歌曲的索引
export const currentSong = (state) => {
    return state.playList[state.currentIndex] || {}
}
export const disc = state => state.disc
export const topList = state => state.topList
export const searchHistory = state => state.searchHistory
export const playHistory = (state) => {
    return state.playHistory.map((song) => {
        return new Song(song)
    })
}

export const favoriteList = (state) => {
    return state.favoriteList.map((song) => {
        return new Song(song)
    })
}