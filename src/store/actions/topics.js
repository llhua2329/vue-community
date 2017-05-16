import { FETCH_TOPICS_REQ, FETCH_TOPICS_SUC, FETCH_TOPICS_ERR } from '../constants/types'
import axios from 'axios'

export const topicsActions = {
    // 请求 topics 数据
    fetchTopicsActions({ commit, state }, params) {
        commit('FETCH_TOPICS_REQ');
        axios({
            method: 'get',
            url: 'topics',
            params: {
                tab: params.tab,
                page: params.page,
                limit: params.limit
            }
        }).then((res) => {
            let data = res.data.data,
                origin = state.data,
                arr = [];
            data.forEach((val, index) => {
                let time = new Date(val.last_reply_at),
                    year = time.getFullYear(),
                    month = time.getMonth() + 1,
                    date = time.getDate();

                let dateStr = year + '-' + month + '-' + date;

                val.last_reply_at = dateStr;
            });
            arr = origin.concat(data);

            if (data.length > 0) {
                commit('FETCH_TOPICS_SUC', {
                    data: arr
                })
            } else {
                commit('TOGGLE_NO_MORE_DATA_STATE');
                commit('FETCH_TOPICS_ERR');
            }
        }).catch((err) => {
            commit('FETCH_TOPICS_ERR', {
                error: err
            });
            console.log(err)
        })
    }
}