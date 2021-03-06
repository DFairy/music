import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
    // import Recommend from 'components/recommend/recommend'
    // import Singer from 'components/singer/singer'
    // import Rank from 'components/rank/rank'
    // import My from 'components/my/my'
    // import SingerDetail from 'components/singer-detail/singer-detail'
    // import Disc from 'components/disc/disc'
    // import TopList from 'components/top-list/top-list'
    // import Search from 'components/search/search'

const Recommend = () =>
    import ('components/recommend/recommend')
const Singer = () =>
    import ('components/singer/singer')
const Rank = () =>
    import ('components/rank/rank')
const My = () =>
    import ('components/my/my')
const SingerDetail = () =>
    import ('components/singer-detail/singer-detail')
const Disc = () =>
    import ('components/disc/disc')
const TopList = () =>
    import ('components/top-list/top-list')
const Search = () =>
    import ('components/search/search')



export default new Router({
    routes: [{
            path: '/',
            redirect: '/recommend'
        },
        {
            path: '/recommend',
            component: Recommend,
            children: [{
                path: ':id',
                component: Disc
            }]
        },
        {
            path: '/singer',
            component: Singer,
            children: [{
                path: ':id',
                component: SingerDetail
            }]
        },
        {
            path: '/rank',
            component: Rank,
            children: [{
                path: ':id',
                component: TopList
            }]
        },
        {
            path: '/my',
            component: My
        },
        {
            path: '/search',
            component: Search,
            children: [{
                path: ':id',
                component: SingerDetail
            }]
        },

    ]
})