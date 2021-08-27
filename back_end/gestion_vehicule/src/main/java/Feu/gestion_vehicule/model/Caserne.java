package Feu.gestion_vehicule.model;



import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "CASERNE")
public class Caserne {
	@Id
	@GeneratedValue
	private Integer idcaserne;
	private double lon;
	private double lat;

	public Caserne() {
		super();
	}

	public Caserne(Integer id, String vehicules, double lat, double lon) {
		super();
		this.idcaserne = id;
		this.lat = lat;
		this.lon = lon;

	}
	
	public double getLon() {
		return lon;
	}

	public void setLon(double lon) {
		this.lon = lon;
	}

	public double getLat() {
		return lat;
	}

	public void setLat(double lat) {
		this.lat = lat;
	}

	public Integer getId() {
		return idcaserne;
	}

	public void setId(Integer id) {
		this.idcaserne = id;
	}


}
