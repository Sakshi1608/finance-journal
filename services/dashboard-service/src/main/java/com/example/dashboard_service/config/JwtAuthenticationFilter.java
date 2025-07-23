package com.example.dashboard_service.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    String authHeader = request.getHeader("Authorization");
        System.out.println(authHeader);
    if(authHeader == null || !authHeader.startsWith("Bearer ")){
        System.out.println("Hello I am here!");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return;
    }

    String token = authHeader.substring(7).replace("\"","").trim();
    System.out.println("token: "+token);
        try{
      JwtParser parser = Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtSecret))).build();
      Claims claims = parser.parseClaimsJws(token).getBody();
        request.setAttribute("username",claims.getSubject());
        String username = claims.getSubject();
        if(username!=null) {
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList());

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    }
    catch(Exception e){
        System.out.println("JWT Error: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return;
    }
    filterChain.doFilter(request,response);
}

}
