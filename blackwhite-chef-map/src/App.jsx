import { useState, useMemo } from 'react';
import Map from './components/Map';
import RestaurantList from './components/RestaurantList';
import RestaurantDetail from './components/RestaurantDetail';
import { restaurants } from './data/restaurants';
import './App.css';

function App() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [teamFilter, setTeamFilter] = useState('all');
  const [seasonFilter, setSeasonFilter] = useState('all');

  // 필터링된 레스토랑 목록
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => {
      const teamMatch = teamFilter === 'all' || r.team === teamFilter;
      const seasonMatch = seasonFilter === 'all' || r.season === seasonFilter;
      return teamMatch && seasonMatch;
    });
  }, [teamFilter, seasonFilter]);

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>흑백요리사 맛집 지도</h1>
        <p>넷플릭스 흑백요리사 출연 셰프들의 레스토랑을 찾아보세요</p>
      </header>

      <main className="app-main">
        <div className="map-section">
          <Map
            restaurants={filteredRestaurants}
            selectedRestaurant={selectedRestaurant}
            onSelectRestaurant={handleSelectRestaurant}
          />
        </div>
        <div className="list-section">
          <RestaurantList
            restaurants={filteredRestaurants}
            selectedRestaurant={selectedRestaurant}
            onSelectRestaurant={handleSelectRestaurant}
            teamFilter={teamFilter}
            onTeamFilterChange={setTeamFilter}
            seasonFilter={seasonFilter}
            onSeasonFilterChange={setSeasonFilter}
          />
        </div>
      </main>

      {/* 상세 페이지 모달 */}
      {showDetail && (
        <RestaurantDetail
          restaurant={selectedRestaurant}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}

export default App;
