package org.example;

public class Main {
    public static void main(String[] arg){
/*       -- when extends Thread class--
          World world=new World();
         world.start();
*/
        World2 world2=new World2();
        Thread t1=new Thread(world2);
        t1.start(); 
        for ( int i=0;i<1000 ;i++)
        System.out.println("hello");

//        System.out.println(Thread.currentThread().getName());
    }
}
