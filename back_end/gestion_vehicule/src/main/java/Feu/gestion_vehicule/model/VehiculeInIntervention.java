package Feu.gestion_vehicule.model;

import java.util.ArrayList;

public class VehiculeInIntervention {
	private Integer vehiculeId;
	private Integer caserneId;
	private Integer fireId; // if if not in intervention.
	private double latFinal;
	private double lonFinal;
	private double latInitial;
	private double lonInitial;
	private boolean inMove;
	private ArrayList<ArrayList> navigation = new ArrayList<ArrayList>();

	public Coord nextMove() {
		double nextLat = (double) navigation.get(0).get(1);
		double nextLon = (double) navigation.get(0).get(0);
		Coord coord = new Coord();
		double ecartLat= latInitial-nextLat;
		double ecartLon=lonInitial-nextLon;
		double distance = Math.sqrt((ecartLat)*(ecartLat)+( ecartLon)*( ecartLon));
		if (distance < 1) {
			coord.lon = nextLon;
			coord.lat = nextLat;
			navigation.remove(0);
			if (navigation.isEmpty()) {
				this.inMove = false;
			}
		} else {
			coord.lon = lonInitial + ecartLon/distance;
			coord.lat = latInitial + ecartLat/distance;
		}
		return coord;

	}

	public void setMove(ArrayList<ArrayList> navigation) {
		this.navigation = navigation;
		this.latInitial = (double) this.navigation.get(0).get(1);
		this.lonInitial = (double) this.navigation.get(0).get(0);
		this.navigation.remove(0);
		this.inMove = true;
	}

	public boolean isInMove() {
		return this.inMove;
	}

	public Integer getCaserneId() {
		return caserneId;
	}
	
	public ArrayList<ArrayList> getNavigation(){
		return this.navigation;
	}
	
	public void setCaserneId(Integer caserneId) {
		this.caserneId = caserneId;
	}

	public VehiculeInIntervention() {
		super();
	}

	public Integer getVehiculeId() {
		return vehiculeId;
	}

	public void setVehiculeId(Integer vehiculeId) {
		this.vehiculeId = vehiculeId;
	}

	public Integer getFireId() {
		return fireId;
	}

	public void affectFire(Integer fireId) {
		this.fireId = fireId;
	}

	public void returnToCasern() {
		this.fireId = null;
	}

	public boolean isInIntervention() {
		return this.fireId != null;
	}
	
	public double getLatFinal() {
		return this.latFinal;
	}
	
	public double getLonFinal() {
		return this.lonFinal;
	}
	
	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		// null check
		if (o == null)
			return false;
		// type check and cast
		if (getClass() != o.getClass())
			return false;
		VehiculeInIntervention vi = (VehiculeInIntervention) o;
		// field comparison
		return this.vehiculeId == vi.vehiculeId;
	}

	@Override
	public int hashCode() {
		return this.vehiculeId.hashCode();
	}

	public class Coord {
		public double lon;
		public double lat;

	}
}
