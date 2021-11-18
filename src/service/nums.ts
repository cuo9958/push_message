import Redis from "../db/redis";

/**
 * 次数累加,默认60秒
 * @param name 名称
 */
export async function setNum(uuid: string, name: string, maxTime = 60) {
    const key = `num_${name}_${uuid}`;
    //先获取
    const num = await Redis.get(key);
    await Redis.incr(key);
    if (!num) {
        //初始化
        Redis.expire(key, maxTime);
    }
}
/**
 * 检查计数次数,默认60次
 * @param uuid uuid
 * @param name 名称
 */
export async function checkNum(uuid: string, name: string, maxNum = 60) {
    const key = `num_${name}_${uuid}`;
    const num = await Redis.get(key);
    if (!num) return;
    if (parseInt(num) > maxNum) throw new Error("超过尝试次数");
}
/**
 * 获取当前可用次数
 * @param uuid uuid
 * @param name 名称
 * @returns 次数
 */
export async function getNum(uuid: string, name: string) {
    const key = `num_${name}_${uuid}`;
    return Redis.get(key);
}
/**
 * 清空次数
 * @param name 名称
 */
export async function clearNum(uuid: string, name: string) {
    const key = `num_${name}_${uuid}`;
}
