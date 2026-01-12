import { useState, useEffect, useRef } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function App() {
  const [restaurants, setRestaurants] = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [progress, setProgress] = useState({ message: '데이터 로딩 중...', current: 0, total: 0 })
  const eventSourceRef = useRef(null)

  useEffect(() => {
    fetchRestaurants(true)
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  const fetchRestaurants = (isInitial = false) => {
    if (isInitial) {
      setInitialLoading(true)
    } else {
      setRefreshing(true)
    }
    setError(null)
    setProgress({ message: '서버 연결 중...', current: 0, total: 0 })

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const eventSource = new EventSource(`${API_URL}/api/restaurants/stream`)
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'progress') {
        setProgress({
          message: data.message,
          current: data.current,
          total: data.total
        })
      } else if (data.type === 'cached') {
        setRestaurants(data.data)
        setInitialLoading(false)
        setRefreshing(false)
        eventSource.close()
      } else if (data.type === 'complete') {
        setRestaurants(data.data)
        setInitialLoading(false)
        setRefreshing(false)
        eventSource.close()
      } else if (data.type === 'error') {
        setError(data.error)
        setInitialLoading(false)
        setRefreshing(false)
        eventSource.close()
      }
    }

    eventSource.onerror = () => {
      setError('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.')
      setInitialLoading(false)
      setRefreshing(false)
      eventSource.close()
    }
  }

  const refresh = async () => {
    await fetch(`${API_URL}/api/refresh`, { method: 'POST' })
    fetchRestaurants(false)
  }

  // 당장 예약 가능 여부 (예약 가능한 날짜가 있는 경우)
  const isAvailableNow = (r) => {
    return r.availableDates?.length > 0
  }

  // 예약 오픈 예정 여부 (오픈 시간이나 기간 정보가 있는 경우 - 마감이어도 오픈 정보 있으면 여기)
  const isUpcoming = (r) => {
    return !r.availableDates?.length &&
           (r.reservationOpenTime || r.reservationPeriod)
  }

  // 예약 마감 여부 (마감이고 오픈 예정 정보가 없는 경우)
  const isClosed = (r) => {
    return r.reservationStatus?.includes('마감') &&
           !r.reservationOpenTime &&
           !r.reservationPeriod
  }

  // 현장 웨이팅 여부 (링크 있고, 예약 정보 없음)
  const isWalkIn = (r) => {
    return r.shopUrl &&
           !r.availableDates?.length &&
           !r.reservationStatus &&
           !r.reservationOpenTime &&
           !r.reservationPeriod
  }

  // 정보 없음 (링크 없음 + 예약 관련 정보도 없음)
  const isNoInfo = (r) => {
    return !r.shopUrl &&
           !r.availableDates?.length &&
           !r.reservationStatus &&
           !r.reservationOpenTime &&
           !r.reservationPeriod
  }

  const filtered = restaurants.filter(r => {
    if (filter === 'available') return isAvailableNow(r)
    if (filter === 'upcoming') return isUpcoming(r)
    if (filter === 'closed') return isClosed(r)
    if (filter === 'walkin') return isWalkIn(r)
    if (filter === 'noinfo') return isNoInfo(r)
    return true
  })

  // 각 탭의 개수 계산
  const availableNowCount = restaurants.filter(r => isAvailableNow(r)).length
  const upcomingCount = restaurants.filter(r => isUpcoming(r)).length
  const closedCount = restaurants.filter(r => isClosed(r)).length
  const walkInCount = restaurants.filter(r => isWalkIn(r)).length
  const noInfoCount = restaurants.filter(r => isNoInfo(r)).length

  return (
    <div className="container">
      {/* 우측 상단 로딩 인디케이터 */}
      {refreshing && (
        <div className="refresh-indicator">
          <div className="refresh-spinner"></div>
          <span>{progress.message}</span>
        </div>
      )}

      <header>
        <h1>흑백요리사 시즌2 예약 정보</h1>
        <p className="subtitle">캐치테이블 예약 정보만 모아서 보기</p>
      </header>

      <div className="controls">
        <div className="tabs">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            전체 <span className="count">{restaurants.length}</span>
          </button>
          <button
            className={filter === 'available' ? 'active' : ''}
            onClick={() => setFilter('available')}
          >
            예약 가능 <span className="count">{availableNowCount}</span>
          </button>
          <button
            className={filter === 'upcoming' ? 'active' : ''}
            onClick={() => setFilter('upcoming')}
          >
            오픈 예정 <span className="count">{upcomingCount}</span>
          </button>
          <button
            className={filter === 'closed' ? 'active' : ''}
            onClick={() => setFilter('closed')}
          >
            예약 마감 <span className="count">{closedCount}</span>
          </button>
          <button
            className={filter === 'walkin' ? 'active' : ''}
            onClick={() => setFilter('walkin')}
          >
            현장 웨이팅 <span className="count">{walkInCount}</span>
          </button>
          <button
            className={filter === 'noinfo' ? 'active' : ''}
            onClick={() => setFilter('noinfo')}
          >
            정보 없음 <span className="count">{noInfoCount}</span>
          </button>
        </div>
        <button className="refresh-btn" onClick={refresh} disabled={refreshing}>
          {refreshing ? '새로고침 중...' : '새로고침'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {initialLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p className="loading-message">{progress.message}</p>
          {progress.total > 0 && (
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          )}
          <p className="loading-sub">첫 로딩은 1-2분 정도 걸릴 수 있습니다</p>
        </div>
      ) : (
        <div className="restaurant-list">
          {filtered.map((r, i) => (
            <div key={i} className="restaurant-card">
              <div className="card-header">
                <span className="chef-name">{r.chef}</span>
                <h2 className="shop-name">{r.name || '매장명 미확인'}</h2>
              </div>

              <div className="card-body">
                <div className="info-row">
                  {r.location && <span className="location">📍 {r.location}</span>}
                  {r.cuisine && <span className="cuisine">{r.cuisine}</span>}
                </div>

                {r.rating && (
                  <div className="info-row">
                    <span className="rating">★ {r.rating}</span>
                    {r.reviewCount && <span className="reviews">리뷰 {r.reviewCount}개</span>}
                  </div>
                )}

                {r.priceInfo && <div className="price">{r.priceInfo}</div>}
                {r.hours && <div className="hours">{r.hours}</div>}

                <div className="reservation-info">
                  {(r.availableDates?.length > 0) ? (
                    <>
                      <div className="status open">예약 가능</div>
                      <div className="available-dates">
                        📅 {r.availableDates.slice(0, 5).join(', ')}
                      </div>
                    </>
                  ) : (r.reservationStatus || r.reservationOpenTime || r.reservationPeriod) ? (
                    <>
                      {r.reservationStatus && (
                        <div className={`status ${r.reservationStatus.includes('마감') ? 'closed' : 'open'}`}>
                          {r.reservationStatus}
                        </div>
                      )}
                      {r.reservationOpenTime && (
                        <div className="open-time">🕐 {r.reservationOpenTime}</div>
                      )}
                      {r.reservationPeriod && (
                        <div className="period">📅 {r.reservationPeriod}</div>
                      )}
                    </>
                  ) : r.shopUrl ? (
                    <div className="status walkin">현장웨이팅</div>
                  ) : (
                    <div className="status noinfo">정보 없음</div>
                  )}
                </div>
              </div>

              {r.shopUrl && (
                <a
                  href={r.shopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reserve-btn"
                >
                  캐치테이블에서 예약하기
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
