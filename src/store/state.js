import { playMode } from 'common/js/config'
import { loadSearch, loadPlay, loadFavorite } from 'common/js/cache'

const state = {
    singer: {}, //歌手
    playing: false, //是否播放
    fullScreen: false, //全屏
    playList: [], //播放列表
    sequenceList: [], //顺序
    mode: playMode.sequence, //播放模式
    currentIndex: -1, //当前播放歌曲的索引
    disc: {},
    topList: {},
    searchHistory: loadSearch(),
    playHistory: loadPlay(),
    favoriteList: loadFavorite()
}

export default state