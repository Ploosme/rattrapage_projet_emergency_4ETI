package Feu.gestion_vehicule;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GestionVehiculeApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestionVehiculeApplication.class, args);
	}

}
