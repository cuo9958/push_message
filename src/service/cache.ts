/**
 * 缓存，本地和redis
 */
import LRU from "lru-cache";
import Redis from "../db/redis";

//默认缓存时间，一周
const DEFAULTAGE = 604800;
//本地缓存时间，一天
const CACHEAGE = 86400;
//本地缓存
const cache = new LRU<string, any>({
    maxAge: CACHEAGE,
    updateAgeOnGet: true,
});

/**
 * 将数据存在缓存和redis
 * @param key key
 * @param data 数据
 * @param time redis存储时间,秒
 */
function set(key: string, data: any, time = CACHEAGE) {
    cache.set(key, data, time * 1000);
    const val = { v: data };
    return Redis.set(key, JSON.stringify(val), "EX", time);
}
/**
 * 根据key获取数据
 * @param key key
 */
async function get(key: string) {
    if (cache.has(key)) return cache.get(key);
    const val = await Redis.get(key);
    if (!val) {
        //本地临时缓存
        cache.set(key, val, 5000);
        return null;
    }
    const data = JSON.parse(val);
    cache.set(key, data.v);
    return data.v;
}
/**
 * 本地缓存
 * @param key key
 * @param data 数据
 */
function setTemp(key: string, data: any, maxAge?: number) {
    cache.set(key, data, maxAge);
}
/**
 * 获取本地缓存
 * @param key key
 */
function getTemp(key: string) {
    return cache.get(key);
}
/**
 * 批量获取
 * @param keys keys
 */
function getTempList(keys: string[]) {
    const values = [];
    keys.forEach((key) => cache.get(key));
    return values;
}
/**
 * 删除key
 * @param key key
 */
function deleteTemp(key: any) {
    cache.del(key);
}

/**
 * 从redis查询
 * @param key key
 * @returns 数据
 */
async function getRedisCache(key: string) {
    const val = await Redis.get(key);
    if (!val) {
        return null;
    }
    const data = JSON.parse(val);
    return data.v;
}
/**
 * 设置redis缓存
 * @param key key
 * @param data data
 * @param time 过期时间
 */
async function setRedisCache(key: string, data: any, time = DEFAULTAGE) {
    const val = { v: data };
    await Redis.set(key, JSON.stringify(val), "EX", time);
}

async function delRedisCache(key: string) {
    await Redis.del(key);
}
/**
 * redis存对象
 * @param key key
 * @param data 对象
 * @returns
 */
async function setRedisObj(key: string, data: any) {
    return Redis.hmset(key, data);
}
/**
 * 获取对象值
 * @param key key
 * @returns
 */
async function getRedisObj(key: string) {
    return Redis.hgetall(key);
}
/**
 * 单独获取字段值
 * @param key key
 * @param field 字段
 * @returns
 */
async function getRedisObjField(key: string, field: string) {
    return Redis.hget(key, field);
}
/**
 * 设置字段的存在秒数
 * @param key key
 * @param seconds 秒数
 * @returns
 */
async function setReidsKeyExpire(key: string, seconds: number) {
    return Redis.expire(key, seconds);
}
export default {
    set,
    get,
    setTemp,
    getTemp,
    getTempList,
    deleteTemp,
    getRedisCache,
    setRedisCache,
    delRedisCache,
    setRedisObj,
    getRedisObj,
    getRedisObjField,
    setReidsKeyExpire,
};
