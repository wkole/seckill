package org.seckill.dto;

/**
 * 暴露秒杀地址DTO
 * Created by Yan on 2017/2/17.
 */
public class Exposer {
    //是否开启秒杀
    private boolean exposed;
    //加密
    private String md5;

    private long seckillId;
    //系统当前时间 毫秒
    private long now;
    //开启时间
    private long strat;
    //结束时间
    private long end;

    public Exposer(boolean exposed, String md5, long seckillId) {
        this.exposed = exposed;
        this.md5 = md5;
        this.seckillId = seckillId;
    }

    public Exposer(boolean exposed, long seckillId, long now, long strat, long end) {
        this.exposed = exposed;
        this.seckillId = seckillId;
        this.now = now;
        this.strat = strat;
        this.end = end;
    }

    public Exposer(boolean exposed, long seckillId) {
        this.exposed = exposed;
        this.seckillId = seckillId;
    }

    @Override
    public String toString() {
        return "Exposer{" +
                "exposed=" + exposed +
                ", md5='" + md5 + '\'' +
                ", seckillId=" + seckillId +
                ", now=" + now +
                ", strat=" + strat +
                ", end=" + end +
                '}';
    }

    public boolean isExposed() {
        return exposed;
    }

    public void setExposed(boolean exposed) {
        this.exposed = exposed;
    }

    public String getMd5() {
        return md5;
    }

    public void setMd5(String md5) {
        this.md5 = md5;
    }

    public long getSeckillId() {
        return seckillId;
    }

    public void setSeckillId(long seckillId) {
        this.seckillId = seckillId;
    }

    public long getNow() {
        return now;
    }

    public void setNow(long now) {
        this.now = now;
    }

    public long getStrat() {
        return strat;
    }

    public void setStrat(long strat) {
        this.strat = strat;
    }

    public long getEnd() {
        return end;
    }

    public void setEnd(long end) {
        this.end = end;
    }
}
