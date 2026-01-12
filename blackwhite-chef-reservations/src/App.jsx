import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:3001'

function App() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/restaurants`)
      const json = await res.json()
      if (json.success) {
        setRestaurants(json.data)
      } else {
        setError(json.error)
      }
    } catch (e) {
      setError('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.')
    }
    setLoading(false)
  }

  const refresh = async () => {
    await fetch(`${API_URL}/api/refresh`, { method: 'POST' })
    fetchRestaurants()
  }

  // 현장 웨이팅 여부 판단
  const isWalkIn = (r) => {
    return !r.availableDates?.length &&
           !r.reservationStatus &&
           !r.reservationOpenTime &&
           !r.reservationPeriod
  }

  // 예약 가능 여부 판단
  const isReservable = (r) => {
    return r.availableDates?.length > 0 ||
           (r.reservationStatus && !r.reservationStatus.includes('마감')) ||
           r.reservationOpenTime ||
           r.reservationPeriod
  }

  const filtered = restaurants.filter(r => {
    if (filter === 'available') {
      return isReservable(r)
    }
    if (filter === 'walkin') {
      return isWalkIn(r)
    }
    return true
  })

  // 각 탭의 개수 계산
  const availableCount = restaurants.filter(r => isReservable(r)).length
  const walkInCount = restaurants.filter(r => isWalkIn(r)).length

  return (
    <div className="container">
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
            예약 가능 <span className="count">{availableCount}</span>
          </button>
          <button
            className={filter === 'walkin' ? 'active' : ''}
            onClick={() => setFilter('walkin')}
          >
            현장 웨이팅 <span className="count">{walkInCount}</span>
          </button>
        </div>
        <button className="refresh-btn" onClick={refresh} disabled={loading}>
          {loading ? '로딩 중...' : '새로고침'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>캐치테이블에서 데이터를 가져오는 중...</p>
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
                  ) : (
                    <div className="status walkin">현장웨이팅</div>
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
