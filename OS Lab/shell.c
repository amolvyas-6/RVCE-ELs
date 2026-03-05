#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <dirent.h>
#include <pwd.h>
#include <fcntl.h>
#include <errno.h>
#include <grp.h>
#include <time.h>
#include <wait.h>
#include "manual.c"

int setpgid(pid_t pid, pid_t pgid);
struct dirent *readdir(DIR *dirp);
int readdir_r(DIR *dirp, struct dirent *entry, struct dirent **result);
int errno;

#define MAX_INPUT_SIZE 1024
#define MAX_TOKEN_SIZE 64
#define MAX_NUM_TOKENS 64
void show_manual(void);



int checkpipe(char *line)
{ int i,count=0;
        for(i=0;i<strlen(line);i++)
        {if(line[i] == '|')
                count++;
        }
        return count;
}


char **pipeparse(char *line)
{
        char **tokens = (char **)malloc(MAX_NUM_TOKENS * sizeof(char *));
        char *token = (char *)malloc(MAX_TOKEN_SIZE * sizeof(char));
        int i, tokenIndex = 0, tokenNo = 0;

        for(i =0; i < strlen(line); i++){

                char readChar = line[i];
                if(line[i-1] == '|')
                        continue;
                if (readChar == '|' || readChar == '\n' || readChar == '\t'){

                        token[tokenIndex] = '\0';
                        if (tokenIndex != 0){
                                tokens[tokenNo] = (char*)malloc(MAX_TOKEN_SIZE*sizeof(char));
                                strcpy(tokens[tokenNo++], token);
                                tokenIndex = 0;
                        }
                } else {

                        token[tokenIndex++] = readChar;
                }
        }

        free(token);
        tokens[tokenNo] = NULL ;
        return tokens;

}

char **tokenize(char *line)
{
        char **tokens = (char **)malloc(MAX_NUM_TOKENS * sizeof(char *));
        char *token = (char *)malloc(MAX_TOKEN_SIZE * sizeof(char));
        int i, tokenIndex = 0, tokenNo = 0;

        for(i =0; i < strlen(line); i++){

                char readChar = line[i];

                if (readChar == ' ' || readChar == '\n' || readChar == '\t'){
                        token[tokenIndex] = '\0';
                        if (tokenIndex != 0){
                                tokens[tokenNo] = (char*)malloc(MAX_TOKEN_SIZE*sizeof(char));
                                strcpy(tokens[tokenNo++], token);
                                tokenIndex = 0;
                        }
                } else {
                        token[tokenIndex++] = readChar;
                }
        }

        free(token);
        tokens[tokenNo] = NULL ;
        return tokens;
}

int main(int argc, char* argv[]) {
        char  line[MAX_INPUT_SIZE];
        char  **tokens;
        int i;

        printf("\n\n------ Welcome to the shell -----\n\n");

        int back=0;
        while(1) {
        	
		char s[1000];
                bzero(line, sizeof(line));
                printf("<Shell>%s " ,getcwd(s,1000));

                scanf("%[^\n]", line);
                getchar();

                if(strcmp(line,"\0")==0)
                        continue;


                line[strlen(line)] = '\n';

                if(checkpipe(line)!=0)
                { int i,num_pipe = checkpipe(line),status;

                        tokens = pipeparse(line);
                        char **str;
                        int pipes[2*num_pipe];
                        for(i=0;i<(2*num_pipe);i+=2)
                                pipe(pipes+i);
                        int j;
                        /*for(j=0;tokens[j]!=NULL;j++)
                                printf("%s\n",tokens[j]);*/
                        int g=0;
                        for(i=0;i<num_pipe+1;i++)
                           {  if(i==num_pipe)
                                  { int len = strlen(tokens[i]);
                                     tokens[i][len-1] = ' ';
                                     strcat(tokens[i]," ");
                                  }
                             str = tokenize(tokens[i]);
                             if(fork()==0)
                                    { if(i==0)
                                          dup2(pipes[1],1);
                                      else if(i==num_pipe)
                                          dup2(pipes[(2*i)-2],0);
                                      else
                                        {dup2(pipes[g],0);
                                         dup2(pipes[g+3],1);
                                         g=g+2;
                                        }
                                        for(j=0;j<(2*num_pipe);j++)
                                               close(pipes[j]);
                                        if(execvp(str[0],str)<0)
                                                printf("INVALID COMMAND\n");
                                      }
                             }
                            for(j=0;j<(2*num_pipe);j++)
                                               close(pipes[j]);

                           for (i = 0; i < num_pipe+1; i++)
                                        wait(&status);


                        continue;
                   }

        tokens = tokenize(line);


                if(strcmp(tokens[0],"exit")==0)
                {printf("***********EXITING*************\n");
                        exit(0);}

                if(strcmp(tokens[0],"cd")==0)
                { char s[1000];
                        if(chdir(tokens[1])==0)
                                printf("changed dir. to : %s\n",getcwd(s,1000));
                        continue;}

                if(strcmp(tokens[0],"pwd")==0)
                { char s[1000];

                        printf("current dir. : %s\n",getcwd(s,1000));
                        continue;}
                if(strcmp(tokens[0],"cp")==0){
                    int BUF_SIZE = 8192;
                    int input_fd, output_fd;
                    ssize_t ret_in, ret_out;
                    char buffer[BUF_SIZE];

                    if (tokens[1] == NULL || tokens[2] == NULL) {
                        printf("Usage ERROR: cp file1 file2");
                    }

                    input_fd = open(tokens[1], O_RDONLY);
                    if (input_fd == -1) {
                        perror("ERROR: open");
                    }

                    output_fd = open(tokens[2], O_WRONLY | O_CREAT, 0644);
                    if (output_fd == -1) {
                        perror("ERROR: open");
                        close(input_fd); 
                        continue;
                    }

                    while ((ret_in = read(input_fd, &buffer, BUF_SIZE)) > 0) {
                        ret_out = write(output_fd, &buffer, (ssize_t)ret_in);
                        if (ret_out != ret_in) {
                            perror("ERROR: write");
                        }
                    }

                    close(input_fd);
                    close(output_fd);
                    }

                if(strcmp(tokens[0],"rm")==0)
			 {

			    if (tokens[1] == NULL) {
				printf("Usage ERROR: rm <file>\n");
				continue;
			    }


			    int result = unlink(tokens[1]);
			    if (result == -1) {

				perror("ERROR: unlink failed");
			    } else {

				printf("File '%s' deleted successfully.\n", tokens[1]);
			    }

			    continue;
			}
		if (strcmp(tokens[0], "man") == 0 || strcmp(tokens[0], "help") ==0) {
		            show_manual();
		            continue; }
		            
                if (strcmp(tokens[0], "mv") == 0) {
			    if (tokens[1] == NULL || tokens[2] == NULL) {
				printf("Usage ERROR: mv <source_file> <destination_file>\n");
				continue;
			    }


			    int link_result = link(tokens[1], tokens[2]);
			    if (link_result == -1) {
				perror("ERROR: Failed to link source to destination");
				continue; 
			    }


			    int unlink_result = unlink(tokens[1]);
			    if (unlink_result == -1) {
				perror("ERROR: Failed to unlink source file");

				unlink(tokens[2]);
			    } else {
				printf("File '%s' moved to '%s' successfully.\n", tokens[1], tokens[2]);
			    }

			    continue;
			}


                if(strcmp(tokens[0],"ls")==0)
                {  {
                      {
                      DIR *d;
                       struct dirent *de;
                       struct stat buf;
                       int i,j;
                       char P[10]="rwxrwxrwx",AP[10]=" ";
                       struct passwd *p;
                       struct group *g;
                       struct tm *t;
                       char time[26];
                       d=opendir(".");
                       readdir(d);
                       readdir(d);
                       while( (de=readdir(d))!=NULL)
                       {
                        stat(de->d_name,&buf);
                        

                        if(S_ISDIR(buf.st_mode))
                         printf("d");
                        else if(S_ISREG(buf.st_mode))
                         printf("-");
                        else if(S_ISCHR(buf.st_mode))
                         printf("c");
                        else if(S_ISBLK(buf.st_mode))
                         printf("b");
                        else if(S_ISLNK(buf.st_mode))
                         printf("l");
                        else if(S_ISFIFO(buf.st_mode))
                         printf("p");
                        else if(S_ISSOCK(buf.st_mode))
                         printf("s");

                        for(i=0,j=(1<<8);i<9;i++,j>>=1)
                         AP[i]= (buf.st_mode & j ) ? P[i] : '-' ;
                        printf("%s",AP);
                        //No. of Hard Links
                        printf("%5d",buf.st_nlink);
                        //User Name
                        p=getpwuid(buf.st_uid);
                        printf(" %.8s",p->pw_name);
                        //Group Name
                        g=getgrgid(buf.st_gid);
                        printf(" %-8.8s",g->gr_name);
                        //File Size
                        printf(" %8d",buf.st_size);
                        //Date and Time of modification
                        t=localtime(&buf.st_mtime);
                        strftime(time,sizeof(time),"%b %d %H:%M",t);
                        printf(" %s",time);
                        //File Name
                        printf(" %s\n",de->d_name);
                       }
                      }

                   }}
                   if(strcmp(tokens[0], "sudo") == 0 && strcmp(tokens[1], "apt") == 0 && strcmp(tokens[2], "install") == 0) {
			    pid_t pid = fork();
			    if(pid == 0) {
				// Combine "sudo" and the rest of the arguments correctly
				char **new_tokens = malloc((argc + 1) * sizeof(char *));
				new_tokens[0] = "sudo"; // The command to execute
				for (int i = 1; tokens[i - 1] != NULL; i++) {
				    new_tokens[i] = tokens[i - 1];
				}

				if(execvp(new_tokens[0], new_tokens) < 0) {
				    perror("ERROR: Failed to execute sudo apt install");
				    free(new_tokens); // Clean up memory
				    exit(1);
				}
			    } else if (pid > 0) {
				wait(NULL); // Wait for child process
			    } else {
				perror("ERROR: Fork failed");
			    }
			    continue;
			}


    pid_t pid = fork();
                for(i=0;tokens[i+1]!=NULL;i++);

                back =0;
                if(strcmp(tokens[i],"&")==0)
                {   
                        back =1;
                        tokens[i]=NULL;
                }

                if (pid == -1) {
                        printf("\nFailed");
                        return 0 ;
                } else if (pid == 0) {
                        if (execvp(tokens[0],tokens) < 0) {
                                printf("\nCould not execute command..\n");
                        }
                        exit(0);
                } else {
                        if(back==0)
                                waitpid(pid,NULL,0);

                }



                for(i=0;tokens[i]!=NULL;i++){
                        free(tokens[i]);
                }
                free(tokens);

        }
        return 0;
} 
             
